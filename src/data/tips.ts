export interface Tip {
  title: string;
  text: string;
}

export const TIPS: Tip[] = [
  { title: 'The 60-30-10 Rule', text: 'Dominant color takes 60% of the composition, secondary 30%, accent only 10%. This distribution creates visual hierarchy without chaos.' },
  { title: 'Saturation Matching', text: 'Colors harmonize better when their saturation levels are similar. Mix vivid and muted in the same palette sparingly, or use it intentionally for emphasis.' },
  { title: 'Temperature Contrast', text: 'Pairing warm and cool hues creates dynamic tension. A cool background with a warm accent naturally draws the eye to interactive elements.' },
  { title: 'Value is Hierarchy', text: 'In monochromatic or brand constrained systems, value difference carries all the visual weight. Never build a palette where all values sit too close together.' },
  { title: 'Desaturate for Neutrals', text: 'Your darkest backgrounds and lightest surfaces should be slightly desaturated tints of your primary hue, not pure blacks and whites. This unifies the system.' },
  { title: 'Test in Grayscale', text: 'Convert every design to grayscale before shipping. If the hierarchy disappears, the design is relying on hue alone. Fix it with value contrast first.' },
  { title: 'WCAG AA at Minimum', text: 'Body text requires a 4.5 to 1 contrast ratio. Large text and UI components require 3 to 1. Reach for AAA at 7 to 1 for critical readability contexts.' },
  { title: 'Simultaneous Contrast', text: 'A gray surrounded by blue appears orange; the same gray surrounded by red appears green. Always evaluate colors in their final context, not in isolation.' },
  { title: 'Brand at 10%', text: 'Flagship brand colors should appear at low frequency but high impact. Overusing a signature color dilutes its power. Reserve it for the moments that matter.' },
  { title: 'Ambient Light Adaptation', text: 'Digital colors shift dramatically with screen brightness and ambient light. Test a palette in dark rooms, daylight, and outdoor conditions before locking it in.' },
  { title: 'Color Blind Accessibility', text: 'About 8% of males have red-green color deficiency. Never convey meaning through hue alone. Use shape, pattern, label, or value contrast as a second signal.' },
  { title: 'Dark Mode is Not Inversion', text: 'Inverting a light palette for dark mode breaks the perceptual hierarchy. Reconstruct the value scale from scratch, keeping hue families but rebuilding tints and shades.' }
];
