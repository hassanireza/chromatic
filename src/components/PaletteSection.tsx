import { usePaletteStore } from '../hooks/usePaletteStore';
import { Swatch } from '../core/Swatch';
import { ColorMath } from '../core/ColorMath';
import { copyText } from '../hooks/useToast';
import type { PaletteView } from '../types/color';

const VIEWS: { value: PaletteView; label: string }[] = [
  { value: 'swatches', label: 'Swatches' },
  { value: 'scales', label: 'Scales' },
  { value: 'contrast', label: 'Contrast' }
];

export function PaletteSection() {
  const { state, store } = usePaletteStore();
  const swatches = state.palette.map((hex) => new Swatch(hex));

  return (
    <section className="palette-section" id="generator">
      <div className="section-header">
        <div className="section-eyebrow">Output</div>
        <h2 className="section-title">Your Palette</h2>
        <div className="palette-actions">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              className={`tool-btn${state.activeView === v.value ? ' active' : ''}`}
              onClick={() => store.setView(v.value)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {state.activeView === 'swatches' && <SwatchGrid swatches={swatches} />}
      {state.activeView === 'swatches' && <ColorCodeGrid swatches={swatches} />}
      {state.activeView === 'scales' && <TintShadeGrid swatches={swatches} />}
      {state.activeView === 'contrast' && <ContrastMatrix swatches={swatches} />}
    </section>
  );
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="palette-display" style={{ display: 'flex' }}>
      {swatches.map((s) => (
        <div className="swatch" key={s.hex} style={{ background: s.hex }} title={s.hex}>
          <button
            className="swatch-copy"
            style={{ color: s.readableTextColor, borderColor: `${s.readableTextColor}33` }}
            onClick={() => copyText(s.hex)}
          >
            Copy
          </button>
          <div className="swatch-info">
            <span className="swatch-hex">{s.hex}</span>
            <span className="swatch-name">{s.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorCodeGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="palette-codes">
      {swatches.map((s) => (
        <div className="color-chip" key={s.hex} onClick={() => copyText(s.hex)}>
          <div className="chip-dot" style={{ background: s.hex }} />
          <div className="chip-codes">
            <span className="chip-hex">{s.hex}</span>
            <span className="chip-rgb">{s.rgbString}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TintShadeGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="tint-shade-section" style={{ display: 'block' }}>
      <h3 className="subsection-title">Tints + Shades Scale</h3>
      <div className="tint-shade-grid">
        {swatches.map((s) => {
          const scale = s.scale();
          return (
            <div className="tint-shade-row" key={s.hex}>
              <span className="ts-label">{s.hex}</span>
              <div className="ts-swatches">
                {scale.map((hex, idx) => (
                  <div
                    key={`${hex}-${idx}`}
                    className="ts-swatch"
                    style={{ background: hex }}
                    title={`${hex} (${(idx + 1) * 100})`}
                    onClick={() => copyText(hex)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContrastMatrix({ swatches }: { swatches: Swatch[] }) {
  const pairs: [Swatch, Swatch][] = [];
  for (let i = 0; i < swatches.length; i++) {
    for (let j = i + 1; j < swatches.length; j++) {
      pairs.push([swatches[i], swatches[j]]);
    }
  }

  return (
    <div className="contrast-section">
      <h3 className="subsection-title">WCAG Contrast Matrix</h3>
      <div className="contrast-grid">
        {pairs.map(([bg, fg]) => {
          const ratio = bg.contrastWith(fg);
          const levels = ColorMath.wcagLevel(ratio);
          return (
            <div className="contrast-row" key={`${bg.hex}-${fg.hex}`}>
              <div className="contrast-swatch-pair">
                <div className="cs-bg" style={{ background: bg.hex }} />
                <div
                  className="cs-fg"
                  style={{
                    background: fg.hex,
                    color: bg.hex,
                    fontSize: 11,
                    fontWeight: 700,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Aa
                </div>
              </div>
              <span className="contrast-ratio">{ratio.toFixed(2)}:1</span>
              <div className="contrast-badges">
                <span className={`badge ${levels.aa ? 'pass' : 'fail'}`}>AA{levels.aa ? ' pass' : ' fail'}</span>
                <span className={`badge ${levels.aaa ? 'pass' : 'fail'}`}>AAA{levels.aaa ? ' pass' : ' fail'}</span>
                <span className={`badge ${levels.aaLarge ? 'pass' : 'fail'}`}>AA Lg{levels.aaLarge ? '' : ' fail'}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {bg.hex} / {fg.hex}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
