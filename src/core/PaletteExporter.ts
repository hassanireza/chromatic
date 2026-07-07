import { ColorMath } from './ColorMath';
import type { ExportFormat, HexColor } from '../types/color';

interface Exporter {
  export(palette: HexColor[]): string;
}

class CssExporter implements Exporter {
  export(palette: HexColor[]): string {
    const lines = [':root {'];
    palette.forEach((hex, i) => {
      const rgb = ColorMath.hexToRgb(hex);
      lines.push(`  --color-${i + 1}: ${hex};`);
      lines.push(`  --color-${i + 1}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`);
    });
    lines.push('}');
    return lines.join('\n');
  }
}

class ScssExporter implements Exporter {
  export(palette: HexColor[]): string {
    const lines = ['// Chromatic Palette\n'];
    palette.forEach((hex, i) => lines.push(`$color-${i + 1}: ${hex};`));
    lines.push('\n$palette: (');
    palette.forEach((hex, i) => lines.push(`  "color-${i + 1}": ${hex},`));
    lines.push(');');
    return lines.join('\n');
  }
}

class JsonExporter implements Exporter {
  export(palette: HexColor[]): string {
    const obj = {
      chromatic: {
        palette: palette.map((hex, i) => {
          const rgb = ColorMath.hexToRgb(hex);
          const hsl = ColorMath.hexToHsl(hex);
          const cmyk = ColorMath.rgbToCmyk(rgb);
          return {
            id: `color-${i + 1}`,
            name: ColorMath.colorName(hex),
            hex,
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
            cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
          };
        })
      }
    };
    return JSON.stringify(obj, null, 2);
  }
}

class AseExporter implements Exporter {
  export(palette: HexColor[]): string {
    const lines = ['// Adobe Swatch Exchange Token Format', '// Import via Illustrator > Swatches > Load Swatches\n'];
    lines.push('CHROMATIC_PALETTE = {');
    palette.forEach((hex, i) => {
      const rgb = ColorMath.hexToRgb(hex);
      lines.push(`  "${ColorMath.colorName(hex)}": {`);
      lines.push(`    "hex": "${hex}",`);
      lines.push(`    "r": ${(rgb.r / 255).toFixed(4)},`);
      lines.push(`    "g": ${(rgb.g / 255).toFixed(4)},`);
      lines.push(`    "b": ${(rgb.b / 255).toFixed(4)},`);
      lines.push(`    "colorSpace": "RGB"`);
      lines.push(`  }${i < palette.length - 1 ? ',' : ''}`);
    });
    lines.push('}');
    return lines.join('\n');
  }
}

class TailwindExporter implements Exporter {
  export(palette: HexColor[]): string {
    const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const lines = ['// tailwind.config.js\n', 'module.exports = {', '  theme: {', '    extend: {', '      colors: {', '        brand: {'];
    palette.forEach((hex, i) => {
      const step = steps[i] ?? (i + 1) * 100;
      lines.push(`          ${step}: '${hex}', // ${ColorMath.colorName(hex)}`);
    });
    lines.push('        }', '      }', '    }', '  }', '};');
    return lines.join('\n');
  }
}

/**
 * PaletteExporter is a facade that dispatches to the correct format
 * specific exporter. Adding a new export target only requires a new
 * Exporter implementation and a registry entry.
 */
export class PaletteExporter {
  private static readonly exporters: Record<ExportFormat, Exporter> = {
    css: new CssExporter(),
    scss: new ScssExporter(),
    json: new JsonExporter(),
    ase: new AseExporter(),
    tailwind: new TailwindExporter()
  };

  static export(palette: HexColor[], format: ExportFormat): string {
    return this.exporters[format].export(palette);
  }
}
