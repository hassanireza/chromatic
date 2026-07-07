import { ColorMath } from '../core/ColorMath';

export interface TheoryCard {
  id: string;
  name: string;
  description: string;
  formula: string;
  swatches: string[];
}

const baseHue = 210;
const at = (h: number, s = 72, l = 52) => ColorMath.hslToHex({ h, s, l });

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: 'complementary',
    name: 'Complementary',
    description:
      'Colors directly opposite on the wheel, 180 degrees apart. Creates maximum contrast and vibration. Use for emphasis: one dominant, one accent at 10 to 20% of the composition.',
    formula: 'H2 = (H1 + 180) mod 360',
    swatches: [at(baseHue), at(baseHue + 180)]
  },
  {
    id: 'analogous',
    name: 'Analogous',
    description:
      'Colors adjacent on the wheel, typically within 30 to 60 degrees. Naturally harmonious and found throughout nature. One hue leads, two support, one is a neutral anchor.',
    formula: 'H2 = H1 \u00b1 30, H3 = H1 \u00b1 60',
    swatches: [at(baseHue - 30, 70), at(baseHue, 72), at(baseHue + 30, 70)]
  },
  {
    id: 'triadic',
    name: 'Triadic',
    description:
      'Three hues equally spaced at 120 degrees. Vibrant and balanced even with desaturated values. Balance with a 60/30/10 split across dominant, secondary, accent.',
    formula: 'H2 = H1 + 120, H3 = H1 + 240',
    swatches: [at(baseHue), at(baseHue + 120), at(baseHue + 240)]
  },
  {
    id: 'split',
    name: 'Split Complementary',
    description:
      'A softer alternative to complementary. Uses a base hue and the two colors adjacent to its complement. Retains high contrast while reducing tension.',
    formula: 'H2 = (H1 + 150) mod 360, H3 = (H1 + 210) mod 360',
    swatches: [at(baseHue), at(baseHue + 150), at(baseHue + 210)]
  },
  {
    id: 'tetradic',
    name: 'Tetradic / Rectangle',
    description:
      'Four hues forming a rectangle on the wheel. Rich and complex. Let one hue dominate and use the others as secondary roles to avoid visual chaos.',
    formula: 'H2 = H1 + 60, H3 = H1 + 180, H4 = H1 + 240',
    swatches: [at(baseHue), at(baseHue + 60), at(baseHue + 180), at(baseHue + 240)]
  },
  {
    id: 'mono',
    name: 'Monochromatic',
    description:
      'Variations in saturation and lightness of a single hue. Elegant, cohesive, and sophisticated. Contrast is achieved through value, not hue, making typography critical.',
    formula: 'S and L vary, H fixed',
    swatches: [at(baseHue, 72, 22), at(baseHue, 72, 38), at(baseHue, 72, 52), at(baseHue, 72, 68), at(baseHue, 72, 82)]
  }
];
