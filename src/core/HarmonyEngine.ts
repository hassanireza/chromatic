import { ColorMath } from './ColorMath';
import type { HarmonyType, HexColor } from '../types/color';

/**
 * A harmony strategy takes a seed hue/saturation/lightness and the seed's
 * hex value, and returns as many colors as requested that follow a
 * particular color theory rule. Each concrete strategy below implements
 * this interface, forming a classic Strategy pattern so new harmonies can
 * be added without touching the engine itself.
 */
interface HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[];
}

/** Builds an HSL hex color, clamping saturation and lightness to tasteful bounds. */
function buildHsl(h: number, s: number, l: number): HexColor {
  return ColorMath.hslToHex({
    h: ColorMath.clampHue(h),
    s: ColorMath.clampSaturation(s),
    l: ColorMath.clampLightness(l)
  });
}

class ComplementaryStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const comp = h + 180;
    if (count === 2) return [seed, buildHsl(comp, s, l)];
    const colors: HexColor[] = [seed];
    const half = Math.ceil((count - 2) / 2);
    for (let i = 1; i <= half; i++) {
      colors.push(buildHsl(h, s, l + i * (40 / (half + 1))));
    }
    colors.push(buildHsl(comp, s, l));
    for (let i = 1; i <= count - colors.length; i++) {
      colors.push(buildHsl(comp, s, l + i * 14));
    }
    return colors.slice(0, count);
  }
}

class AnalogousStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const step = 28;
    const colors: HexColor[] = [seed];
    const offsets = [step, -step, step * 2, -step * 2, step * 3, -step * 3];
    for (let i = 0; colors.length < count; i++) {
      colors.push(buildHsl(h + offsets[i], s * (0.85 + i * 0.05), l + (i % 2 === 0 ? 6 : -6)));
    }
    return colors.slice(0, count);
  }
}

class TriadicStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const bases = [seed, buildHsl(h + 120, s, l), buildHsl(h + 240, s, l)];
    if (count <= 3) return bases.slice(0, count);
    const colors = [...bases];
    const extra = count - 3;
    for (let i = 0; i < extra; i++) {
      const base = bases[i % 3];
      const bHsl = ColorMath.hexToHsl(base);
      colors.push(buildHsl(bHsl.h, bHsl.s * 0.7, bHsl.l + 20));
    }
    return colors.slice(0, count);
  }
}

class TetradicStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const bases = [seed, buildHsl(h + 60, s, l), buildHsl(h + 180, s, l), buildHsl(h + 240, s, l)];
    if (count <= 4) return bases.slice(0, count);
    const colors = [...bases];
    const extra = count - 4;
    for (let i = 0; i < extra; i++) {
      const base = bases[i % 4];
      const bHsl = ColorMath.hexToHsl(base);
      colors.push(buildHsl(bHsl.h + 15, bHsl.s * 0.75, bHsl.l + 18));
    }
    return colors.slice(0, count);
  }
}

class SplitComplementaryStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const bases = [seed, buildHsl(h + 150, s, l), buildHsl(h + 210, s, l)];
    if (count <= 3) return bases.slice(0, count);
    const colors = [...bases];
    for (let i = 0; colors.length < count; i++) {
      const base = bases[i % 3];
      const bHsl = ColorMath.hexToHsl(base);
      colors.push(buildHsl(bHsl.h, bHsl.s * 0.65, bHsl.l + 16));
    }
    return colors.slice(0, count);
  }
}

class SquareStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const bases = [seed, buildHsl(h + 90, s, l), buildHsl(h + 180, s, l), buildHsl(h + 270, s, l)];
    if (count <= 4) return bases.slice(0, count);
    const colors = [...bases];
    for (let i = 0; colors.length < count; i++) {
      const base = bases[i % 4];
      const bHsl = ColorMath.hexToHsl(base);
      colors.push(buildHsl(bHsl.h + 10, bHsl.s * 0.6, bHsl.l + 22));
    }
    return colors.slice(0, count);
  }
}

class MonochromaticStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const colors: HexColor[] = [seed];
    const lStep = 60 / (count + 1);
    for (let i = 1; colors.length < count; i++) {
      const newL = ((l + i * lStep - 30 + 100) % 80) + 10;
      const newS = Math.max(10, s - i * 8);
      colors.push(buildHsl(h, newS, newL));
    }
    return colors.slice(0, count);
  }
}

class CompoundStrategy implements HarmonyStrategy {
  generate(h: number, s: number, l: number, count: number, seed: HexColor): HexColor[] {
    const comp = h + 180;
    const bases = [
      seed,
      buildHsl(h + 30, s * 0.8, l),
      buildHsl(comp, s, l),
      buildHsl(comp + 30, s * 0.8, l + 10),
      buildHsl(h - 30, s * 0.7, l + 15),
      buildHsl(comp - 30, s * 0.7, l - 10)
    ];
    return bases.slice(0, count);
  }
}

/**
 * HarmonyEngine is the public facade over the color theory strategies.
 * It owns a registry mapping each HarmonyType to its strategy instance
 * and dispatches generation requests to the correct one.
 */
export class HarmonyEngine {
  private static readonly strategies: Record<HarmonyType, HarmonyStrategy> = {
    complementary: new ComplementaryStrategy(),
    analogous: new AnalogousStrategy(),
    triadic: new TriadicStrategy(),
    tetradic: new TetradicStrategy(),
    'split-complementary': new SplitComplementaryStrategy(),
    square: new SquareStrategy(),
    monochromatic: new MonochromaticStrategy(),
    compound: new CompoundStrategy()
  };

  static generate(seedHex: string, count: number, type: HarmonyType): HexColor[] {
    const seed = seedHex || ColorMath.randomVivid();
    const { h, s, l } = ColorMath.hexToHsl(seed);
    const strategy = this.strategies[type] ?? this.strategies.analogous;
    return strategy.generate(h, s, l, count, seed);
  }

  static get availableTypes(): HarmonyType[] {
    return Object.keys(this.strategies) as HarmonyType[];
  }
}
