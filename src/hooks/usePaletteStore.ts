import { useSyncExternalStore } from 'react';
import { paletteStore } from '../core/PaletteStore';

/**
 * Subscribes a component to the shared PaletteStore instance. Using
 * useSyncExternalStore keeps the store framework agnostic while still
 * giving React components tear-free, concurrent-safe reads.
 */
export function usePaletteStore() {
  const state = useSyncExternalStore(paletteStore.subscribe, paletteStore.getState);
  return { state, store: paletteStore };
}
