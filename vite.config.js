import { defineConfig } from 'vite'
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'

const mkcertConfig = {
  hosts: ['localhost', '127.0.0.1', 'henrymusic.test', 'henrymusic.local'],
  keyFileName: 'henrymusic.local+5-key.pem',
  certFileName: 'henrymusic.local+5.pem'
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(mkcertConfig)],
  server: { https: true },
})
