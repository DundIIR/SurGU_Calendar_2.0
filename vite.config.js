import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = 'http://localhost:8000'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'^/api': {
				target: backend,
				ws: false,
				secure: false,
			},
		},
	},
})
