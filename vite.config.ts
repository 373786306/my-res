import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
    vue(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
      logger: true 
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  server: {
    port: parseInt(env.VITE_SERVER_PORT) ||5173,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8090',
    //     changeOrigin: true,                   
    //     secure: false,                         
    //     rewrite: (path) => path.replace(/^\/api/, '/api')
    //   }
    // }
  },
  base: '/git@github.com:373786306/my-res.git/',
  }
})
