import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development or production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    // Only use repo base path in production (GitHub Pages)
    base: mode === 'production' ? '/CSE-416-Team3/' : '/',
    define: {
      // Makes env variables available in frontend
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
