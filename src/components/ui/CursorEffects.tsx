import React, { useEffect, useRef, useState } from 'react';

interface ClickFlash {
  id: number;
  x: number;
  y: number;
}

/**
 * Premium pointer layer:
 *  - a soft light that travels with the cursor
 *  - a tiny light flash on every click that switches itself off
 */
export const CursorEffects: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [flashes, setFlashes] = useState<ClickFlash[]>([]);

  useEffect(() => {
    let frame = 0;
    let targetX = -200;
    let targetY = -200;

    const paint = () => {
      frame = 0;
      const el = glowRef.current;
      if (el) {
        el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setFlashes((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setFlashes((prev) => prev.filter((flash) => flash.id !== id));
      }, 650);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />

      {flashes.map((flash) => (
        <span
          key={flash.id}
          aria-hidden="true"
          className="click-flash fixed z-[99] pointer-events-none w-4 h-4 rounded-full border border-sky-300/90 bg-sky-400/30 shadow-[0_0_16px_4px_rgba(56,189,248,0.55)]"
          style={{ left: flash.x, top: flash.y }}
        />
      ))}
    </>
  );
};
