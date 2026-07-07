import { useEffect, useRef } from 'react';
import { HeroCanvasRenderer } from '../core/HeroCanvasRenderer';
import { usePaletteStore } from '../hooks/usePaletteStore';

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<HeroCanvasRenderer | null>(null);
  const { state } = usePaletteStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new HeroCanvasRenderer(canvasRef.current);
    rendererRef.current = renderer;
    renderer.start();
    return () => renderer.stop();
  }, []);

  useEffect(() => {
    rendererRef.current?.setPalette(state.palette);
  }, [state.palette]);

  return <canvas ref={canvasRef} width={520} height={520} />;
}
