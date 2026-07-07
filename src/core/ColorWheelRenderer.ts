import { ColorMath } from './ColorMath';
import type { HSL } from '../types/color';

export class ColorWheelRenderer {
  private ctx: CanvasRenderingContext2D;
  readonly outerRadius: number;
  readonly innerRadius: number;
  readonly ringWidth = 36;
  readonly cx: number;
  readonly cy: number;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    this.ctx = ctx;
    this.cx = canvas.width / 2;
    this.cy = canvas.height / 2;
    this.outerRadius = canvas.width / 2 - 8;
    this.innerRadius = this.outerRadius - this.ringWidth;
  }

  draw(hsl: HSL): void {
    const { ctx, cx, cy, outerRadius, innerRadius, ringWidth } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let deg = 0; deg < 360; deg += 0.8) {
      const a1 = ((deg - 90) * Math.PI) / 180;
      const a2 = ((deg + 1.5 - 90) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * innerRadius, cy + Math.sin(a1) * innerRadius);
      ctx.arc(cx, cy, outerRadius, a1, a2);
      ctx.arc(cx, cy, innerRadius, a2, a1, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${deg}, 90%, 55%)`;
      ctx.fill();
    }

    const angle = ((hsl.h - 90) * Math.PI) / 180;
    const dotR = outerRadius - ringWidth / 2;
    const dx = cx + Math.cos(angle) * dotR;
    const dy = cy + Math.sin(angle) * dotR;
    ctx.beginPath();
    ctx.arc(dx, dy, 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(dx, dy, 7, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hsl.h}, 90%, 55%)`;
    ctx.fill();
  }

  hueFromPoint(x: number, y: number): number {
    const dx = x - this.cx;
    const dy = y - this.cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    return angle;
  }

  isInRing(x: number, y: number): boolean {
    const dx = x - this.cx;
    const dy = y - this.cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d >= this.innerRadius && d <= this.outerRadius;
  }

  toCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }
}

export class SLPickerRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    this.ctx = ctx;
  }

  draw(hsl: HSL): void {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const hue = hsl.h;

    for (let x = 0; x < w; x++) {
      const s = (x / w) * 100;
      const grad = ctx.createLinearGradient(x, 0, x, h);
      grad.addColorStop(0, `hsl(${hue}, ${s}%, 95%)`);
      grad.addColorStop(0.5, `hsl(${hue}, ${s}%, 50%)`);
      grad.addColorStop(1, `hsl(${hue}, ${s}%, 5%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 1, h);
    }

    const sx = (hsl.s / 100) * w;
    const sy = (1 - (hsl.l - 5) / 90) * h;
    ctx.beginPath();
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fillStyle = ColorMath.hslToHex(hsl);
    ctx.fill();
  }

  toCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(this.canvas.width, (clientX - rect.left) * (this.canvas.width / rect.width)));
    const y = Math.max(0, Math.min(this.canvas.height, (clientY - rect.top) * (this.canvas.height / rect.height)));
    return { x, y };
  }

  static valuesFromCoords(x: number, y: number, width: number, height: number): { s: number; l: number } {
    return { s: (x / width) * 100, l: 5 + (1 - y / height) * 90 };
  }
}
