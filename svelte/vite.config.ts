import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve('src')
		}
	},
	plugins: [
		sveltekit()
	],
	// server: {
	// 	fs: {
	// 		allow: ["./colorglyph-sdk"]
	// 	}
	// },
	ssr: {
		noExternal: ['@vespaiach/axios-fetch-adapter']
	},
	optimizeDeps: {
		entries: [],
		esbuildOptions: {
			define: {
				
			},
			plugins: [

			]
		}
	},
	build: {
		minify: 'esbuild',
		sourcemap: true,
		rollupOptions: {
			plugins: [
				
			]
		}
	}
});
