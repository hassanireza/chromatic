import { useEffect, useRef } from 'react';

interface NavProps {
  onExportClick: () => void;
}

export function Nav({ onExportClick }: NavProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleScroll = () => {
      nav.style.borderBottomColor =
        window.scrollY > 40 ? 'rgba(200, 184, 162, 0.14)' : 'rgba(200, 184, 162, 0.08)';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-logo">
        <span className="logo-mark">C</span>
        <span className="logo-text">CHROMATIC</span>
      </div>
      <div className="nav-links">
        <a href="#generator" className="nav-link">Generator</a>
        <a href="#wheel" className="nav-link">Color Wheel</a>
        <a href="#theory" className="nav-link">Theory</a>
        <a href="#palettes" className="nav-link">Palettes</a>
      </div>
      <div className="nav-actions">
        <button className="btn-ghost" onClick={onExportClick}>Export</button>
      </div>
    </nav>
  );
}
