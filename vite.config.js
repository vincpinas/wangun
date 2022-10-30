import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'

export default defineConfig({
  server: {
    hmr: true,
  },
  plugins: [
    liveReload(['src/Scenes/*.ts', 'src/Classes/*.ts', 'src/*.ts',])
  ]
})