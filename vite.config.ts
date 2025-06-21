import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // 代理API请求以解决CORS问题
      '/api/apicore': {
        target: 'https://api.apicore.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/apicore/, ''),
        secure: true,
        headers: {
          'Origin': 'https://api.apicore.ai'
        }
      }
    }
  }
});
