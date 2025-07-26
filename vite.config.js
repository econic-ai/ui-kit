import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	server: {
		fs: {
			strict: false
		}
	},
	
	css: {
		preprocessorOptions: {
			sass: {
				// Make SASS files findable by @use and @import
				additionalData: '@use "src/lib/styles/index.sass" as *;'
			}
		}
	}
});