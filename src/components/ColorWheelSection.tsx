import { useEffect, useRef, useState } from 'react';
import { ColorWheelRenderer, SLPickerRenderer } from '../core/ColorWheelRenderer';
import { ColorMath } from '../core/ColorMath';
import { HarmonyEngine } from '../core/HarmonyEngine';
import { Swatch } from '../core/Swatch';
import { usePaletteStore } from '../hooks/usePaletteStore';
import { copyText, toastController } from '../hooks/useToast';

export function ColorWheelSection() {
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
  const slCanvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRendererRef = useRef<ColorWheelRenderer | null>(null);
  const slRendererRef = useRef<SLPickerRenderer | null>(null);
  const draggingRef = useRef<'wheel' | 'sl' | null>(null);

  const { state, store } = usePaletteStore();
  const [hsl, setHsl] = useState({ h: 0, s: 100, l: 50 });

  useEffect(() => {
    if (wheelCanvasRef.current) wheelRendererRef.current = new ColorWheelRenderer(wheelCanvasRef.current);
    if (slCanvasRef.current) slRendererRef.current = new SLPickerRenderer(slCanvasRef.current);
  }, []);

  useEffect(() => {
    wheelRendererRef.current?.draw(hsl);
    slRendererRef.current?.draw(hsl);
  }, [hsl]);

  useEffect(() => {
    const handleUp = () => (draggingRef.current = null);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const handleWheelPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const renderer = wheelRendererRef.current;
    if (!renderer) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const { x, y } = renderer.toCanvasCoords(point.clientX, point.clientY);
    if (renderer.isInRing(x, y)) {
      draggingRef.current = 'wheel';
      setHsl((prev) => ({ ...prev, h: renderer.hueFromPoint(x, y) }));
    }
  };

  const handleWheelPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingRef.current !== 'wheel') return;
    const renderer = wheelRendererRef.current;
    if (!renderer) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const { x, y } = renderer.toCanvasCoords(point.clientX, point.clientY);
    setHsl((prev) => ({ ...prev, h: renderer.hueFromPoint(x, y) }));
  };

  const handleSlPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    draggingRef.current = 'sl';
    updateFromSl(e);
  };

  const handleSlPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingRef.current !== 'sl') return;
    updateFromSl(e);
  };

  const updateFromSl = (e: React.MouseEvent | React.TouchEvent) => {
    const renderer = slRendererRef.current;
    const canvas = slCanvasRef.current;
    if (!renderer || !canvas) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const { x, y } = renderer.toCanvasCoords(point.clientX, point.clientY);
    const { s, l } = SLPickerRenderer.valuesFromCoords(x, y, canvas.width, canvas.height);
    setHsl((prev) => ({ ...prev, s, l }));
  };

  const hex = ColorMath.hslToHex(hsl);
  const swatch = new Swatch(hex);
  const harmonyPreview = HarmonyEngine.generate(hex, 5, state.harmony);

  const addToPalette = () => {
    store.addColor(hex);
    toastController.show(`${hex} added to palette`);
  };

  return (
    <section className="wheel-section" id="wheel">
      <div className="section-header">
        <div className="section-eyebrow">Interactive</div>
        <h2 className="section-title">Color Wheel</h2>
      </div>
      <div className="wheel-layout">
        <div className="wheel-container">
          <canvas
            ref={wheelCanvasRef}
            width={480}
            height={480}
            onMouseDown={handleWheelPointerDown}
            onMouseMove={handleWheelPointerMove}
            onTouchStart={(e) => {
              handleWheelPointerDown(e);
            }}
            onTouchMove={(e) => {
              handleWheelPointerMove(e);
            }}
          />
          <div className="wheel-center" style={{ background: hex }} />
        </div>
        <div className="wheel-controls">
          <div className="wheel-info">
            <div className="info-row">
              <span className="info-label">Hue</span>
              <span className="info-val">{Math.round(hsl.h)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Saturation</span>
              <span className="info-val">{Math.round(hsl.s)}%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Lightness</span>
              <span className="info-val">{Math.round(hsl.l)}%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Hex</span>
              <span className="info-val mono">{swatch.hex}</span>
            </div>
            <div className="info-row">
              <span className="info-label">RGB</span>
              <span className="info-val mono">{swatch.rgb.r}, {swatch.rgb.g}, {swatch.rgb.b}</span>
            </div>
            <div className="info-row">
              <span className="info-label">CMYK</span>
              <span className="info-val mono">{swatch.cmyk.c}, {swatch.cmyk.m}, {swatch.cmyk.y}, {swatch.cmyk.k}</span>
            </div>
          </div>
          <div className="sl-picker-wrap">
            <label className="count-label">Saturation / Lightness</label>
            <canvas
              ref={slCanvasRef}
              width={240}
              height={160}
              onMouseDown={handleSlPointerDown}
              onMouseMove={handleSlPointerMove}
              onTouchStart={(e) => {
                handleSlPointerDown(e);
              }}
              onTouchMove={(e) => {
                handleSlPointerMove(e);
              }}
            />
          </div>
          <div className="wheel-add-wrap">
            <button className="btn-add-color" onClick={addToPalette}>Add to Palette</button>
          </div>
          <div className="harmony-preview">
            <label className="count-label">Harmony preview</label>
            <div className="harmony-swatches">
              {harmonyPreview.map((c, i) => (
                <div
                  key={`${c}-${i}`}
                  className="h-swatch"
                  style={{ background: c }}
                  title={c}
                  onClick={() => copyText(c)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
