import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@animal-clamp/puppet': path.resolve(__dirname, '../../packages/puppet/src/index.ts'),
    },
  },
});
