import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined);

const useResizeObserver = (
  callback: () => void,
  elements: React.RefObject<HTMLElement | null>[],
  dependencies: any[]
) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: any[]
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad, seqRef, ...dependencies]);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Prefers-reduced-motion check
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
};

export interface LogoItem {
  name?: string;
  title?: string;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  node?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  ariaLabel?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  grayscale?: boolean;
  renderItem?: (item: LogoItem, key: string) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  onLogoClick?: (item: LogoItem) => void;
  activeBrand?: string;
}

export const LogoLoop = memo(
  ({
    logos,
    speed = 80,
    direction = 'left',
    width = '100%',
    logoHeight = 32,
    gap = 36,
    pauseOnHover = true,
    hoverSpeed,
    fadeOut = true,
    fadeOutColor = '#0A0A0C',
    scaleOnHover = true,
    grayscale = true,
    renderItem,
    ariaLabel = 'Hardware manufacturer partners',
    className,
    style,
    onLogoClick,
    activeBrand,
  }: LogoLoopProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [hiddenImages, setHiddenImages] = useState<Record<string, boolean>>({});

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier: number;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;

      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`) {
            containerRef.current.style.height = `${targetHeight}px`;
          }
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
    useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        [
          'logoloop',
          isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'logoloop--fade',
          scaleOnHover && 'logoloop--scale-hover',
          grayscale && 'logoloop--grayscale',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, grayscale, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);

    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const handleImageError = useCallback((imgKey: string) => {
      setHiddenImages((prev) => ({ ...prev, [imgKey]: true }));
    }, []);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: string) => {
        const itemIdentifier = item.name || item.title || key;
        if (hiddenImages[itemIdentifier]) {
          return null;
        }

        if (renderItem) {
          return (
            <li className="logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          );
        }

        const isItemActive =
          item.active ||
          (activeBrand &&
            (item.name?.toLowerCase() === activeBrand.toLowerCase() ||
              item.title?.toLowerCase() === activeBrand.toLowerCase()));

        const isNodeItem = 'node' in item && Boolean(item.node);

        const content = isNodeItem ? (
          <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
            {item.node}
          </span>
        ) : item.src ? (
          <img
            src={item.src}
            srcSet={item.srcSet}
            sizes={item.sizes}
            width={item.width}
            height={item.height || logoHeight}
            alt={item.alt ?? item.name ?? item.title ?? 'brand logo'}
            title={item.title ?? item.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => handleImageError(itemIdentifier)}
          />
        ) : (
          <span className="text-xs font-sans font-bold tracking-wider text-neutral-300">
            {item.name || item.title}
          </span>
        );

        const itemAriaLabel = isNodeItem
          ? item.ariaLabel ?? item.title ?? item.name
          : item.alt ?? item.title ?? item.name;

        const handleClick = (e: React.MouseEvent) => {
          if (item.onClick) {
            e.preventDefault();
            item.onClick();
          } else if (onLogoClick) {
            e.preventDefault();
            onLogoClick(item);
          }
        };

        const itemContent = item.href ? (
          <a
            className={`logoloop__link ${isItemActive ? 'is-active' : ''}`}
            href={item.href}
            aria-label={itemAriaLabel || 'brand partner link'}
            onClick={item.onClick || onLogoClick ? handleClick : undefined}
          >
            {content}
          </a>
        ) : item.onClick || onLogoClick ? (
          <button
            type="button"
            className={`logoloop__link ${isItemActive ? 'is-active' : ''}`}
            aria-label={itemAriaLabel || 'brand filter button'}
            onClick={handleClick}
          >
            {content}
          </button>
        ) : (
          content
        );

        return (
          <li
            className={`logoloop__item ${isItemActive ? 'is-active' : ''}`}
            key={key}
            role="listitem"
          >
            {itemContent}
          </li>
        );
      },
      [renderItem, activeBrand, logoHeight, hiddenImages, handleImageError, onLogoClick]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style, isVertical]
    );

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
      >
        <div
          className="logoloop__track"
          ref={trackRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
