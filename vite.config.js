import { defineConfig } from 'vitest/config'; // Import the defineConfig function from Vitest
import vue from '@vitejs/plugin-vue'; // Import the Vue plugin for Vite

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js', // Used as a part of the setup for the unit tests.
  },
});