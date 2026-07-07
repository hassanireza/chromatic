import { useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { PaletteSection } from './components/PaletteSection';
import { ColorWheelSection } from './components/ColorWheelSection';
import { TheorySection } from './components/TheorySection';
import { PresetsSection } from './components/PresetsSection';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

export function App() {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <Nav onExportClick={() => setExportOpen(true)} />
      <Hero />
      <PaletteSection />
      <ColorWheelSection />
      <TheorySection />
      <PresetsSection />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <Toast />
      <Footer />
    </>
  );
}
