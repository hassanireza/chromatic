import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Base path is set to the GitHub Pages repository name so built asset URLs
// resolve correctly when served from https://<user>.github.io/chromatic/
export default defineConfig({
    plugins: [react()],
    base: '/chromatic/',
    build: {
        outDir: 'dist',
        sourcemap: false
    }
});
