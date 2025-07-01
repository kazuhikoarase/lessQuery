import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
 
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/lessq.ts'),
      name: 'lessq',
      fileName: (format, entryName) =>
        format == 'cjs'? `${entryName}.js` :
        format == 'es'? `${entryName}.mjs` :
        `${entryName}.${format}.js`,
      formats: ['cjs', 'es'],
    },
  },
  plugins: [
    dts({
      rollupTypes : true,
    })
  ]
});
