import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'
import fs from 'fs';


export default defineConfig({
  server: {
    hmr: true,
    open: true,
    port: 3000,
    // https: {
    //   key: fs.readFileSync('https/wangun.dev.key'),
    //   cert: fs.readFileSync('https/wangun.dev.crt')
    // },
    // host: 'wangun.dev'
  },
  plugins: [
    liveReload(['src/Scenes/*.ts', 'src/Classes/*.ts', 'src/*.ts',]),
  ],
  base: './',
  assetsInclude: ['**/*glb', '**/*.fbx'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  }
})