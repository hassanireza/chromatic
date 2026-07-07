import { useState } from 'react';
import { usePaletteStore } from '../hooks/usePaletteStore';
import { HeroCanvas } from './HeroCanvas';
import type { HarmonyType } from '../types/color';

const HARMONIES: { value: HarmonyType; label: string }[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'split-complementary', label: 'Split Compl.' },
  { value: 'square', label: 'Square' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'compound', label: 'Compound' }
];

export function Hero() {
  const { state, store } = usePaletteStore();
  const [hexDraft, setHexDraft] = useState('');

  const handleHexChange = (value: string) => {
    const clean = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    setHexDraft(clean);
  };

  const handleGenerate = () => {
    const seed = hexDraft.length === 6 ? `#${hexDraft}` : '';
    store.setSeed(seed);
    store.generate();
  };

  const previewStyle =
    hexDraft.length === 6
      ? { background: `#${hexDraft}`, border: 'none' }
      : { background: 'var(--surface)', border: '1px solid var(--border)' };

  return (
    <section className="hero">
      <div className="hero-bg-grid" />
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="dot-pulse" />
          Professional Color Intelligence
        </div>
        <h1 className="hero-title">
          <span className="title-line">Color</span>
          <span className="title-line accent">Harmony</span>
          <span className="title-line">Engine</span>
        </h1>
        <p className="hero-desc">
          Build mathematically precise color systems grounded in perceptual science, harmonic theory, and
          professional design practice. Start from any hex or from nothing.
        </p>
        <div className="hero-input-group">
          <div className="hex-input-wrap">
            <span className="hash">#</span>
            <input
              type="text"
              className="hex-input"
              maxLength={6}
              placeholder="Enter hex or leave blank"
              spellCheck={false}
              autoComplete="off"
              value={hexDraft}
              onChange={(e) => handleHexChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <div className="hex-preview" style={previewStyle} />
          </div>
          <div className="count-wrap">
            <label className="count-label">Colors</label>
            <div className="count-controls">
              <button className="count-btn" onClick={() => store.setCount(state.count - 1)}>-</button>
              <span className="count-val">{state.count}</span>
              <button className="count-btn" onClick={() => store.setCount(state.count + 1)}>+</button>
            </div>
          </div>
          <div className="harmony-select-wrap">
            <label className="count-label">Harmony</label>
            <select
              className="harmony-select"
              value={state.harmony}
              onChange={(e) => store.setHarmony(e.target.value as HarmonyType)}
            >
              {HARMONIES.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>
          <button className="btn-generate" onClick={handleGenerate}>
            <span className="btn-label">Generate</span>
            <span className="btn-arrow">&#8594;</span>
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <HeroCanvas />
      </div>
    </section>
  );
}
