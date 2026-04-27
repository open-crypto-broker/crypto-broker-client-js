import { defineConfig } from 'tsdown';
import { execSync } from 'node:child_process';

const pkgVersion = execSync("npm pkg get version | tr -d '\"'")
  .toString()
  .trim();
const gitCommit = execSync('git rev-parse HEAD').toString().trim();

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
    __GIT_COMMIT__: JSON.stringify(gitCommit),
  },
});
