import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node',
  },
  jsx: 'transform',
  jsxImportSource: 'react',
  clean: true,
  sourcemap: false,
})
