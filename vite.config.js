import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  base: "/roadtrip/",
  plugins: [
      react(),
      tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      plugins: [nodePolyfills()], // Fix for matrix-js-sdk
    },
  },
  define: { global: "window" }, // Fix for matrix-js-sdk
});