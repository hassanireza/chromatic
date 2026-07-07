import { useSyncExternalStore } from 'react';

interface ToastSnapshot {
  message: string;
  visible: boolean;
}

class ToastController {
  private snapshot: ToastSnapshot = { message: '', visible: false };
  private timer: ReturnType<typeof setTimeout> | undefined;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // Returns the same cached object reference until the state actually
  // changes. useSyncExternalStore requires a stable snapshot reference
  // across calls with no change, or it will re-render in an infinite
  // loop (React error #185).
  getSnapshot = (): ToastSnapshot => this.snapshot;

  private setSnapshot(next: ToastSnapshot): void {
    this.snapshot = next;
    this.listeners.forEach((l) => l());
  }

  show(message: string): void {
    this.setSnapshot({ message, visible: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setSnapshot({ message: this.snapshot.message, visible: false });
    }, 2400);
  }
}

export const toastController = new ToastController();

export function useToast() {
  const snapshot = useSyncExternalStore(toastController.subscribe, toastController.getSnapshot);
  return { ...snapshot, show: toastController.show.bind(toastController) };
}

export async function copyText(text: string): Promise<void> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toastController.show(`Copied: ${text}`);
  } catch {
    toastController.show('Copy failed. Please copy manually.');
  }
}
