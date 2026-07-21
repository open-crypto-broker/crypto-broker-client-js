import { defineConfig } from 'tsdown';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version: pkgVersion } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

const gitHash = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();

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
  define: {
    __VERSION__: JSON.stringify(pkgVersion),
    __GIT_HASH__: JSON.stringify(gitHash),
  },
});
