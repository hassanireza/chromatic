import { useSyncExternalStore } from 'react';

class ToastController {
  private message = '';
  private visible = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): { message: string; visible: boolean } => ({
    message: this.message,
    visible: this.visible
  });

  show(message: string): void {
    this.message = message;
    this.visible = true;
    this.listeners.forEach((l) => l());
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.visible = false;
      this.listeners.forEach((l) => l());
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
