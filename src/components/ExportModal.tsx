import { useState } from 'react';
import { PaletteExporter } from '../core/PaletteExporter';
import { usePaletteStore } from '../hooks/usePaletteStore';
import { copyText } from '../hooks/useToast';
import type { ExportFormat } from '../types/color';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { value: ExportFormat; label: string }[] = [
  { value: 'css', label: 'CSS Variables' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'ase', label: 'ASE Tokens' },
  { value: 'tailwind', label: 'Tailwind' }
];

const FALLBACK_PALETTE = ['#C8B8A2', '#7C6FCD', '#F0EDE8', '#0A0A0F', '#2A2A35'];

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { state } = usePaletteStore();
  const [format, setFormat] = useState<ExportFormat>('css');

  const palette = state.palette.length > 0 ? state.palette : FALLBACK_PALETTE;
  const code = PaletteExporter.export(palette, format);

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Export Palette</h3>
          <button className="modal-close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="modal-body">
          <div className="export-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`export-tab${format === tab.value ? ' active' : ''}`}
                onClick={() => setFormat(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <pre className="export-code">{code}</pre>
          <button className="btn-copy" onClick={() => copyText(code)}>Copy to Clipboard</button>
        </div>
      </div>
    </div>
  );
}
