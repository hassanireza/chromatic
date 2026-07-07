import { useEffect, useRef } from 'react';

const HOVER_SELECTOR =
  'a, button, input, select, canvas, .swatch, .preset-card, .theory-card, .tip-card, .ts-swatch, .h-swatch';

/**
 * Renders the ring and dot custom cursor and animates the ring toward the
 * pointer with an exponential ease, matching the original vanilla build.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      raf = requestAnimationFrame(animate);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(HOVER_SELECTOR) || target.closest(HOVER_SELECTOR)) {
        cursor.classList.add('hovering');
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(HOVER_SELECTOR) || target.closest(HOVER_SELECTOR)) {
        cursor.classList.remove('hovering');
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}
