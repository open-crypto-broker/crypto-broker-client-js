import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/client.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist/lib',
  deps: {
    onlyBundle: false,
  },
});
