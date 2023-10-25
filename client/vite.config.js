import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server proxy to reduce code when writing fetching data
  // when it sees '/api', 'http://localhost:3000' is added to the front
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      }
    },
    plugins: [react()],
  }
})
