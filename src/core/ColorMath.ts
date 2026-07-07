import type { RGB, HSL, CMYK, WcagLevels, HexColor } from '../types/color';

/**
 * ColorMath is a stateless utility class holding every low level color
 * space conversion and perceptual calculation used by the application.
 * It is kept static-only so it can be used as a pure function library
 * from anywhere in the app without instantiation.
 */
export class ColorMath {
  private constructor() {
    // Prevent instantiation. This class is a static namespace only.
  }

  static hexToRgb(hex: HexColor): RGB {
    let clean = hex.replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const n = parseInt(clean, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  static rgbToHex({ r, g, b }: RGB): HexColor {
    return (
      '#' +
      [r, g, b]
        .map((v) => Math.round(v).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }

  static rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  static hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r: number;
    let g: number;
    let b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  static rgbToCmyk({ r, g, b }: RGB): CMYK {
    r /= 255;
    g /= 255;
    b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - r - k) / (1 - k)) * 100),
      m: Math.round(((1 - g - k) / (1 - k)) * 100),
      y: Math.round(((1 - b - k) / (1 - k)) * 100),
      k: Math.round(k * 100)
    };
  }

  static hexToHsl(hex: HexColor): HSL {
    return this.rgbToHsl(this.hexToRgb(hex));
  }

  static hslToHex(hsl: HSL): HexColor {
    return this.rgbToHex(this.hslToRgb(hsl));
  }

  /** Relative luminance per WCAG 2.1. */
  static relativeLuminance({ r, g, b }: RGB): number {
    const lin = (v: number): number => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }

  static contrastRatio(hexA: HexColor, hexB: HexColor): number {
    const lA = this.relativeLuminance(this.hexToRgb(hexA));
    const lB = this.relativeLuminance(this.hexToRgb(hexB));
    const lighter = Math.max(lA, lB);
    const darker = Math.min(lA, lB);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static wcagLevel(ratio: number): WcagLevels {
    if (ratio >= 7) return { aa: true, aaa: true, aaLarge: true, aaaLarge: true };
    if (ratio >= 4.5) return { aa: true, aaa: false, aaLarge: true, aaaLarge: true };
    if (ratio >= 3) return { aa: false, aaa: false, aaLarge: true, aaaLarge: false };
    return { aa: false, aaa: false, aaLarge: false, aaaLarge: false };
  }

  static adjustLightness(hex: HexColor, amount: number): HexColor {
    const hsl = this.hexToHsl(hex);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return this.hslToHex(hsl);
  }

  static adjustSaturation(hex: HexColor, amount: number): HexColor {
    const hsl = this.hexToHsl(hex);
    hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
    return this.hslToHex(hsl);
  }

  /** Ten step tint and shade scale, from near black to near white. */
  static generateScale(hex: HexColor): HexColor[] {
    const hsl = this.hexToHsl(hex);
    const steps: HexColor[] = [];
    for (let i = 9; i >= 0; i--) {
      const l = 10 + i * 8;
      steps.push(this.hslToHex({ h: hsl.h, s: hsl.s, l }));
    }
    return steps;
  }

  /** Human readable approximation of a color's name. */
  static colorName(hex: HexColor): string {
    const { h, s, l } = this.hexToHsl(hex);
    if (s < 8) {
      if (l < 10) return 'Near Black';
      if (l < 30) return 'Dark Gray';
      if (l < 55) return 'Gray';
      if (l < 80) return 'Light Gray';
      return 'Near White';
    }
    const hueName = this.hueName(h);
    const modifier = l < 30 ? 'Dark ' : l > 70 ? 'Light ' : s > 80 ? 'Vivid ' : '';
    return modifier + hueName;
  }

  private static hueName(h: number): string {
    if (h < 15 || h >= 345) return 'Red';
    if (h < 35) return 'Red-Orange';
    if (h < 55) return 'Orange';
    if (h < 70) return 'Yellow-Orange';
    if (h < 85) return 'Yellow';
    if (h < 105) return 'Yellow-Green';
    if (h < 150) return 'Green';
    if (h < 175) return 'Teal';
    if (h < 200) return 'Cyan';
    if (h < 230) return 'Sky Blue';
    if (h < 260) return 'Blue';
    if (h < 285) return 'Blue-Violet';
    if (h < 310) return 'Violet';
    if (h < 330) return 'Magenta';
    return 'Pink';
  }

  static randomVivid(): HexColor {
    const h = Math.random() * 360;
    const s = 55 + Math.random() * 35;
    const l = 38 + Math.random() * 24;
    return this.hslToHex({ h, s, l });
  }

  static clampHue(h: number): number {
    return ((h % 360) + 360) % 360;
  }

  static clampSaturation(s: number): number {
    return Math.max(8, Math.min(92, s));
  }

  static clampLightness(l: number): number {
    return Math.max(10, Math.min(90, l));
  }
}
