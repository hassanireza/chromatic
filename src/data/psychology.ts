export interface PsychologyEntry {
  color: string;
  name: string;
  traits: string[];
}

export const PSYCHOLOGY: PsychologyEntry[] = [
  { color: '#E63946', name: 'Red', traits: ['Energy', 'Passion', 'Urgency', 'Danger'] },
  { color: '#E87C2E', name: 'Orange', traits: ['Warmth', 'Creativity', 'Enthusiasm', 'Friendly'] },
  { color: '#F4C842', name: 'Yellow', traits: ['Optimism', 'Clarity', 'Warmth', 'Attention'] },
  { color: '#2E9E5A', name: 'Green', traits: ['Growth', 'Harmony', 'Health', 'Nature'] },
  { color: '#2563EB', name: 'Blue', traits: ['Trust', 'Calm', 'Depth', 'Professional'] },
  { color: '#7C3AED', name: 'Violet', traits: ['Luxury', 'Wisdom', 'Royalty', 'Mystery'] },
  { color: '#DB2777', name: 'Pink', traits: ['Tenderness', 'Playful', 'Romance', 'Modern'] },
  { color: '#B45309', name: 'Brown', traits: ['Earthy', 'Reliable', 'Warmth', 'Stability'] },
  { color: '#111827', name: 'Black', traits: ['Power', 'Elegance', 'Mystery', 'Bold'] },
  { color: '#F9FAFB', name: 'White', traits: ['Purity', 'Clean', 'Minimal', 'Space'] },
  { color: '#9CA3AF', name: 'Gray', traits: ['Neutral', 'Balance', 'Timeless', 'Subtle'] },
  { color: '#0E7490', name: 'Teal', traits: ['Clarity', 'Sophistication', 'Balance', 'Tech'] }
];
