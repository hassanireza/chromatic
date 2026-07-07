import { HarmonyEngine } from './HarmonyEngine';
import type { HarmonyType, HexColor, PaletteView } from '../types/color';

export interface PaletteState {
  palette: HexColor[];
  seedHex: string;
  count: number;
  harmony: HarmonyType;
  activeView: PaletteView;
}

type Listener = () => void;

const STORAGE_KEY = 'chromatic:last-palette';

/**
 * PaletteStore is a small observable store, implemented as a plain class
 * rather than a bespoke React state hook, so the palette generation logic
 * stays framework agnostic and testable in isolation. Components read
 * from it through the usePaletteStore hook, which subscribes via
 * useSyncExternalStore.
 */
export class PaletteStore {
  private state: PaletteState;
  private listeners = new Set<Listener>();

  constructor(initial?: Partial<PaletteState>) {
    this.state = {
      palette: [],
      seedHex: '',
      count: 5,
      harmony: 'analogous',
      activeView: 'swatches',
      ...initial
    };
    this.state.palette = HarmonyEngine.generate(this.state.seedHex, this.state.count, this.state.harmony);
  }

  getState = (): PaletteState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private set(partial: Partial<PaletteState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l());
    this.persist();
  }

  private persist(): void {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ palette: this.state.palette, seedHex: this.state.seedHex, harmony: this.state.harmony, count: this.state.count })
      );
    } catch {
      // Storage may be unavailable (private browsing, disabled cookies). Fail silently.
    }
  }

  setCount(count: number): void {
    this.set({ count: Math.max(2, Math.min(10, count)) });
  }

  setHarmony(harmony: HarmonyType): void {
    this.set({ harmony });
  }

  setSeed(seedHex: string): void {
    this.set({ seedHex });
  }

  setView(view: PaletteView): void {
    this.set({ activeView: view });
  }

  generate(): void {
    const palette = HarmonyEngine.generate(this.state.seedHex, this.state.count, this.state.harmony);
    this.set({ palette });
  }

  addColor(hex: HexColor): void {
    this.set({ palette: [...this.state.palette, hex] });
  }

  loadPreset(colors: HexColor[]): void {
    this.set({ palette: [...colors], activeView: 'swatches' });
  }
}

export const paletteStore = new PaletteStore();
