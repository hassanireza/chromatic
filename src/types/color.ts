export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface WcagLevels {
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'square'
  | 'monochromatic'
  | 'compound';

export type ExportFormat = 'css' | 'scss' | 'json' | 'ase' | 'tailwind';

export type PaletteView = 'swatches' | 'scales' | 'contrast';

export type PresetCategory = 'editorial' | 'brand' | 'digital' | 'print' | 'nature';

export interface PresetPalette {
  name: string;
  type: PresetCategory;
  colors: string[];
}

/** A hex color string, always in the form #RRGGBB (uppercase). */
export type HexColor = string;
