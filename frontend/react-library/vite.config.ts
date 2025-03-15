import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl-localhost/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl-localhost/localhost.crt')),
    },
    host: 'localhost',
    // port: 3001
  }
  // root: 'public',
  // build: {
  //   outDir: '../dist',
  //   rollupOptions: {
  //     input: 'public/index.html',
  //   },
  // },
})
