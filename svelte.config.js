import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Enable preprocessing for SASS in Svelte components
	preprocess: vitePreprocess(),
	
	kit: {
		adapter: adapter()
	}
};

export default config;