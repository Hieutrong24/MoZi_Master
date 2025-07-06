import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 5189,
    strictPort:true,
  }
})

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // địa chỉ backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

