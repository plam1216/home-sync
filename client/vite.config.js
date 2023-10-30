import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // server proxy to avoid CORs error and reduce code
  // when it sees '/api', replaces with 'http://localhost:3000'
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
