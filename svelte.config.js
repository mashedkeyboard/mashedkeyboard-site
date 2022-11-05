import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: true,
			strict: true
		}),
		inlineStyleThreshold: 4096, // inline styles smaller than 4kb
		trailingSlash: 'never'
	},
	preprocess: sveltePreprocess({preserve: ['ld+json']})
};

export default config;
