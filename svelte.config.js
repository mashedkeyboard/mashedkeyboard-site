import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from "mdsvex";
import a11yEmoji from '@fec/remark-a11y-emoji';
import setBlogPlaintext from './src/lib/blog/PlaintextGenerator.js';
import setBlogImages from './src/lib/blog/ImagesImportGenerator.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/blog/*/mentions', '/blog/webmention']
			}
		}),
		inlineStyleThreshold: 4096, // inline styles smaller than 4kb
		csrf: {
			checkOrigin: false // this is normally very sensible behaviour, but the only route we use here is webmention, and we don't want it for it.
		}
	},
	extensions: [
		'.svelte',
		'.svx'
	],
	preprocess: [sveltePreprocess({preserve: ['ld+json'], scss: {includePaths: ['src/lib/scss'], prependData: `@import 'global';`}}), mdsvex({
		remarkPlugins: [[a11yEmoji], [setBlogPlaintext], [setBlogImages]]
	})]
};

export default config;
