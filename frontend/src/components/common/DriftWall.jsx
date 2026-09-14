import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriftWall.css';

const DEFAULT_ITEMS = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
    href: undefined,
  };
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 230,
  tileHeight = 175,
  gap = 18,
  radius = 16,
  tilt = 14,
  turn = -12,
  roll = 0,
  perspective = 1300,
  depth = 110,
  speed = 34,
  direction = 'up',
  variance = 0.35,
  parallax = 0.6,
  pauseOnHover = true,
  lift = 64,
  fade = 0.55,
  dim = 0.9,
  grayscale = false,
  overlayColor = '#000000',
  className = '',
  style,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  // ── Animation state (all refs for high-frequency updates) ─────────────────
  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  // ── Drag state ────────────────────────────────────────────────────────────
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    moved: false,
    threshold: 5, // px — below this is a click, above is a drag
  });

  // ── React state (only for things that affect rendering) ──────────────────
  const [containerHeight, setContainerHeight] = useState(600);
  const [reduced, setReduced] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [responsiveCols, setResponsiveCols] = useState(columns);

  // ── Responsive columns ────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setResponsiveCols(Math.min(columns, 3));
      else if (w < 1024) setResponsiveCols(Math.min(columns, 4));
      else setResponsiveCols(columns);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  // ── Prefers reduced motion ────────────────────────────────────────────────
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ── Intersection observer (pause when offscreen) ──────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Items & columns ───────────────────────────────────────────────────────
  const safeItems = items && items.length > 0 ? items : DEFAULT_ITEMS;

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: responsiveCols }, () => []);
    safeItems.forEach((item, i) => cols[i % responsiveCols].push(item));
    return cols.map((col) => (col.length ? col : safeItems.slice(0, 1)));
  }, [safeItems, responsiveCols]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  // ── Container height observer ─────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Base velocities ───────────────────────────────────────────────────────
  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  // ── Initialize offsets & velocities ───────────────────────────────────────
  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  // ── Apply plane transform (parallax tilt) ─────────────────────────────────
  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  // ── Main animation loop (requestAnimationFrame) ───────────────────────────
  useEffect(() => {
    if (!isInView) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    const animate = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      // Parallax tilt damping
      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      // Column scrolling
      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = (wallHoveredRef.current && pauseOnHover) || dragRef.current.isDragging;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [isInView, baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  // ── Hover activation ──────────────────────────────────────────────────────
  const activate = useCallback((colIndex) => {
    hoveredColRef.current = colIndex;
  }, []);

  const release = useCallback(() => {
    hoveredColRef.current = -1;
  }, []);

  // ── Pointer move (parallax + no setState) ─────────────────────────────────
  const handlePointerMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Parallax update
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }

      // Drag tracking
      if (dragRef.current.isDragging) {
        dragRef.current.currentX = e.clientX;
        dragRef.current.currentY = e.clientY;
        const dx = dragRef.current.currentX - dragRef.current.startX;
        const dy = dragRef.current.currentY - dragRef.current.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > dragRef.current.threshold) {
          dragRef.current.moved = true;
        }
      }
    },
    [parallax, reduced]
  );

  // ── Pointer down (start drag) ─────────────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.currentX = e.clientX;
    dragRef.current.currentY = e.clientY;
    dragRef.current.moved = false;
  }, []);

  // ── Pointer up (end drag) ─────────────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);

  // ── Pointer leave ─────────────────────────────────────────────────────────
  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    dragRef.current.isDragging = false;
    dragRef.current.moved = false;
    release();
  }, [release]);

  // ── Tile click (with drag discrimination) ─────────────────────────────────
  const handleTileClick = useCallback(
    (item, e) => {
      // If a drag just occurred, suppress navigation
      if (dragRef.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current.moved = false;
        return;
      }

      if (!item.href) return;
      if (item.href.startsWith('http://') || item.href.startsWith('https://')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.href);
      }
    },
    [navigate]
  );

  // ── CSS vars ──────────────────────────────────────────────────────────────
  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style,
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  // ── Render tile ───────────────────────────────────────────────────────────
  const renderTile = useCallback(
    (item, id, colIndex) => {
      const formattedPrice = item.price
        ? typeof item.price === 'number'
          ? `₹${item.price.toLocaleString('en-IN')}`
          : item.price.startsWith('₹')
          ? item.price
          : `₹${item.price}`
        : null;

      return (
        <div
          key={id}
          className="drift-wall__tile"
          data-tile-id={id}
          data-col={colIndex}
          tabIndex={0}
          role="button"
          aria-label={item.title ? `View ${item.title}` : 'View hardware component'}
          onMouseEnter={() => activate(colIndex)}
          onMouseLeave={release}
          onFocus={() => activate(colIndex)}
          onBlur={release}
          onClick={(e) => handleTileClick(item, e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!dragRef.current.moved) handleTileClick(item, e);
            }
          }}
        >
          <span className="drift-wall__inner group">
            <div className="drift-wall__img-wrap">
              <img
                src={item.image}
                alt={item.title ?? ''}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            <span className="drift-wall__overlay" aria-hidden="true" />

            {/* Product info card */}
            {(item.title || item.price) && (
              <div className="drift-wall__card-info">
                {item.title && (
                  <h4 className="drift-wall__title" title={item.title}>
                    {item.title}
                  </h4>
                )}
                <div className="drift-wall__footer">
                  {formattedPrice && (
                    <span className="drift-wall__price">{formattedPrice}</span>
                  )}
                  <span className="drift-wall__cta">Inspect &rarr;</span>
                </div>
              </div>
            )}
          </span>
        </div>
      );
    },
    [activate, release, handleTileClick]
  );

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="3D hardware wall gallery"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={(el) => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
