import { ColorMath } from './ColorMath';
import type { HexColor } from '../types/color';

/**
 * Encapsulates the animated hero color wheel drawn on a canvas element.
 * Kept as its own class so the imperative canvas loop is isolated from
 * React's render cycle; the component only starts and stops it.
 */
export class HeroCanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private cx: number;
  private cy: number;
  private readonly outerRadius = 210;
  private readonly innerRadius = 90;
  private tick = 0;
  private frame = 0;
  private palette: HexColor[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    this.ctx = ctx;
    this.cx = canvas.width / 2;
    this.cy = canvas.height / 2;
  }

  setPalette(palette: HexColor[]): void {
    this.palette = palette;
  }

  start(): void {
    const loop = () => {
      this.draw();
      this.tick++;
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.frame);
  }

  private draw(): void {
    const { ctx, cx, cy, outerRadius: R, innerRadius: r } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const ringWidth = 44;
    for (let deg = 0; deg < 360; deg += 0.5) {
      const a1 = ((deg - 90) * Math.PI) / 180;
      const a2 = ((deg + 1 - 90) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * (R - ringWidth), cy + Math.sin(a1) * (R - ringWidth));
      ctx.arc(cx, cy, R, a1, a2);
      ctx.arc(cx, cy, R - ringWidth, a2, a1, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${deg}, 88%, 56%)`;
      ctx.fill();
    }

    const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r - 8);
    inner.addColorStop(0, 'rgba(255,255,255,0.92)');
    inner.addColorStop(0.5, 'rgba(180,140,220,0.5)');
    inner.addColorStop(1, 'rgba(60,40,100,0.85)');
    ctx.beginPath();
    ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();

    if (this.palette.length > 1) {
      this.drawHarmonyDots();
    } else {
      this.drawIdleDots();
    }
  }

  private drawHarmonyDots(): void {
    const { ctx, cx, cy, outerRadius: R } = this;
    const dotR = R - 22;
    ctx.save();
    this.palette.forEach((hex, i) => {
      const hsl = ColorMath.hexToHsl(hex);
      const angle = ((hsl.h - 90) * Math.PI) / 180;
      const x = cx + Math.cos(angle) * dotR;
      const y = cy + Math.sin(angle) * dotR;

      if (i > 0) {
        const prevHsl = ColorMath.hexToHsl(this.palette[i - 1]);
        const prevAngle = ((prevHsl.h - 90) * Math.PI) / 180;
        const prevX = cx + Math.cos(prevAngle) * dotR;
        const prevY = cy + Math.sin(prevAngle) * dotR;
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.restore();
  }

  private drawIdleDots(): void {
    const { ctx, cx, cy, outerRadius: R, tick } = this;
    const dotR = R - 22;
    const numDots = 6;
    for (let i = 0; i < numDots; i++) {
      const angle = ((i * 60 + tick * 0.4 - 90) * Math.PI) / 180;
      const x = cx + Math.cos(angle) * dotR;
      const y = cy + Math.sin(angle) * dotR;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${i * 60 + tick * 0.4}, 88%, 56%)`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
