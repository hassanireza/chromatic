import { useState } from 'react';
import { PRESETS } from '../data/presets';
import { usePaletteStore } from '../hooks/usePaletteStore';
import { toastController } from '../hooks/useToast';
import type { PresetCategory } from '../types/color';

type FilterValue = PresetCategory | 'all';

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'brand', label: 'Brand' },
  { value: 'digital', label: 'Digital' },
  { value: 'print', label: 'Print' },
  { value: 'nature', label: 'Nature' }
];

export function PresetsSection() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const { store } = usePaletteStore();

  const visible = PRESETS.filter((p) => filter === 'all' || p.type === filter);

  const handleSelect = (name: string, colors: string[]) => {
    store.loadPreset(colors);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
    toastController.show(`Loaded: ${name}`);
  };

  return (
    <section className="palettes-section" id="palettes">
      <div className="section-header">
        <div className="section-eyebrow">Curated</div>
        <h2 className="section-title">Design Palettes</h2>
        <div className="palette-filter">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="preset-grid">
        {visible.map((preset) => (
          <div className="preset-card" key={preset.name} onClick={() => handleSelect(preset.name, preset.colors)}>
            <div className="preset-swatches">
              {preset.colors.map((c, i) => (
                <div key={`${c}-${i}`} className="preset-swatch" style={{ background: c }} />
              ))}
            </div>
            <div className="preset-meta">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-type">{preset.type}</span>
              <span className="preset-use">Use palette</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
