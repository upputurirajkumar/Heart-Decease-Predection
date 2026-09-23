import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base so built assets resolve correctly on GitHub Pages under any subpath (/Heart-Decease-Predection/) as well as on root domains (Vercel, localhost)
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
