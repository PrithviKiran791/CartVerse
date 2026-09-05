import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Shuffle.css';

gsap.registerPlugin(ScrollTrigger);

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

export default function Shuffle({
  text = '',
  parts = null,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  shuffleTimes = 3,
  ease = 'power3.out',
  stagger = 0.03,
  threshold = 0.1,
  triggerOnce = true,
  triggerOnHover = false,
  loop = false,
  loopDelay = 0,
}) {
  const containerRef = useRef(null);
  const animatedRef = useRef(false);

  // Normalize text items: array of { char, className, partIndex, wordIndex, isSpace }
  const charList = useMemo(() => {
    const items = [];
    const sourceParts = parts || [{ text, className: '' }];

    sourceParts.forEach((part, pIdx) => {
      const words = part.text.split(' ');
      words.forEach((word, wIdx) => {
        for (let i = 0; i < word.length; i++) {
          items.push({
            id: `p${pIdx}-w${wIdx}-c${i}`,
            char: word[i],
            className: part.className || '',
            partIndex: pIdx,
            wordIndex: wIdx,
            isSpace: false,
          });
        }
        if (wIdx < words.length - 1) {
          items.push({
            id: `p${pIdx}-w${wIdx}-space`,
            char: ' ',
            className: part.className || '',
            partIndex: pIdx,
            wordIndex: wIdx,
            isSpace: true,
          });
        }
      });
    });

    return items;
  }, [text, parts]);

  const [displayedChars, setDisplayedChars] = useState(() =>
    charList.map((item) => item.char)
  );
  const [isScrambling, setIsScrambling] = useState(() =>
    charList.map(() => false)
  );

  // Keep displayedChars updated if text/parts prop changes
  useEffect(() => {
    setDisplayedChars(charList.map((item) => item.char));
    setIsScrambling(charList.map(() => false));
  }, [charList]);

  const getRandomChar = useCallback(() => {
    return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
  }, []);

  const triggerAnimation = useCallback(() => {
    if (!containerRef.current || charList.length === 0) return;

    const total = charList.length;

    charList.forEach((item, index) => {
      if (item.isSpace) return;

      let delay = index * stagger;
      if (shuffleDirection === 'left') {
        delay = (total - 1 - index) * stagger;
      } else if (shuffleDirection === 'center') {
        delay = Math.abs(index - total / 2) * stagger;
      } else if (shuffleDirection === 'random') {
        delay = Math.random() * (total * stagger);
      }

      const totalScrambles = Math.max(3, shuffleTimes * 4);
      const stepDuration = Math.max(20, (duration * 1000) / totalScrambles);

      setTimeout(() => {
        let count = 0;
        setIsScrambling((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });

        const interval = setInterval(() => {
          count++;
          if (count < totalScrambles) {
            setDisplayedChars((prev) => {
              const next = [...prev];
              next[index] = getRandomChar();
              return next;
            });
          } else {
            clearInterval(interval);
            setDisplayedChars((prev) => {
              const next = [...prev];
              next[index] = item.char;
              return next;
            });
            setIsScrambling((prev) => {
              const next = [...prev];
              next[index] = false;
              return next;
            });
          }
        }, stepDuration);
      }, delay * 1000);
    });
  }, [charList, duration, getRandomChar, shuffleDirection, shuffleTimes, stagger]);

  useEffect(() => {
    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: `top ${100 - threshold * 100}%`,
      onEnter: () => {
        if (!animatedRef.current || !triggerOnce) {
          triggerAnimation();
          animatedRef.current = true;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [threshold, triggerAnimation, triggerOnce]);

  useEffect(() => {
    if (!loop) return;

    const totalAnimTime = (charList.length * stagger + duration + loopDelay) * 1000;
    const interval = setInterval(() => {
      triggerAnimation();
    }, Math.max(2500, totalAnimTime));

    return () => clearInterval(interval);
  }, [loop, loopDelay, charList.length, stagger, duration, triggerAnimation]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      triggerAnimation();
    }
  };

  // Group characters into words for proper line wrapping
  const wordsGrouped = useMemo(() => {
    const words = [];
    let currentWord = [];

    charList.forEach((item, idx) => {
      if (item.isSpace) {
        if (currentWord.length > 0) {
          words.push(currentWord);
          currentWord = [];
        }
      } else {
        currentWord.push({ ...item, globalIndex: idx });
      }
    });
    if (currentWord.length > 0) {
      words.push(currentWord);
    }
    return words;
  }, [charList]);

  return (
    <div
      ref={containerRef}
      className={`shuffle-container ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
    >
      {wordsGrouped.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          <span className="shuffle-word">
            {word.map((item) => (
              <span
                key={item.id}
                className={`shuffle-char ${item.className} ${
                  isScrambling[item.globalIndex] ? 'is-scrambling' : ''
                }`}
              >
                {displayedChars[item.globalIndex]}
              </span>
            ))}
          </span>
          {wIdx < wordsGrouped.length - 1 && (
            <span className="shuffle-space">&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
