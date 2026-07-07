import { ColorMath } from './ColorMath';
import type { RGB, HSL, CMYK, HexColor } from '../types/color';

/**
 * Swatch is the fundamental object of the application. It wraps a single
 * hex color and lazily derives every other representation of it (RGB,
 * HSL, CMYK, contrast text color, human readable name) on demand,
 * caching each result the first time it is requested.
 */
export class Swatch {
  readonly hex: HexColor;

  private _rgb?: RGB;
  private _hsl?: HSL;
  private _cmyk?: CMYK;
  private _name?: string;
  private _luminance?: number;

  constructor(hex: HexColor) {
    this.hex = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  }

  static fromHsl(hsl: HSL): Swatch {
    return new Swatch(ColorMath.hslToHex(hsl));
  }

  static random(): Swatch {
    return new Swatch(ColorMath.randomVivid());
  }

  get rgb(): RGB {
    if (!this._rgb) this._rgb = ColorMath.hexToRgb(this.hex);
    return this._rgb;
  }

  get hsl(): HSL {
    if (!this._hsl) this._hsl = ColorMath.hexToHsl(this.hex);
    return this._hsl;
  }

  get cmyk(): CMYK {
    if (!this._cmyk) this._cmyk = ColorMath.rgbToCmyk(this.rgb);
    return this._cmyk;
  }

  get name(): string {
    if (!this._name) this._name = ColorMath.colorName(this.hex);
    return this._name;
  }

  get luminance(): number {
    if (this._luminance === undefined) this._luminance = ColorMath.relativeLuminance(this.rgb);
    return this._luminance;
  }

  /** Returns black or white, whichever reads better on top of this color. */
  get readableTextColor(): HexColor {
    return this.luminance > 0.3 ? '#111111' : '#FFFFFF';
  }

  contrastWith(other: Swatch | HexColor): number {
    const otherHex = other instanceof Swatch ? other.hex : other;
    return ColorMath.contrastRatio(this.hex, otherHex);
  }

  scale(): HexColor[] {
    return ColorMath.generateScale(this.hex);
  }

  withLightness(amount: number): Swatch {
    return new Swatch(ColorMath.adjustLightness(this.hex, amount));
  }

  withSaturation(amount: number): Swatch {
    return new Swatch(ColorMath.adjustSaturation(this.hex, amount));
  }

  get rgbString(): string {
    return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
  }

  get hslString(): string {
    const { h, s, l } = this.hsl;
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }

  get cmykString(): string {
    const { c, m, y, k } = this.cmyk;
    return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
  }

  toString(): string {
    return this.hex;
  }
}
