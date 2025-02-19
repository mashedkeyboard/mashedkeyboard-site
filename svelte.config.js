import adapter from '@sveltejs/adapter-cloudflare';
import { sveltePreprocess } from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import a11yEmoji from '@fec/remark-a11y-emoji';
import setBlogPlaintext from './src/lib/blog/PlaintextGenerator.js';
import * as tsImport from 'ts-import';

const blogParser = await tsImport.load('./src/lib/blog/BlogParser.ts', {
	mode: tsImport.LoadMode.Compile,
	compiledJsExtension: '.js'
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/blog/*/mentions.json', '/blog/*/mentions', '/blog/webmention']
			}
		}),
		inlineStyleThreshold: 4096, // inline styles smaller than 4kb
		csrf: {
			checkOrigin: false // this is normally very sensible behaviour, but the only route we use here is webmention, and we don't want it for it.
		},
		prerender: {
			handleHttpError: ({ path, status, message }) => {
				if (path === '/blog/webmention' && status == 405) {
					// expect 405 Method Not Allowed on GET request to webmention endpoint
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx'],
	preprocess: [
		sveltePreprocess({
			preserve: ['ld+json'],
			scss: { includePaths: ['src/lib/scss'], prependData: `@use '_vars';` }
		}),
		mdsvex({
			remarkPlugins: [[a11yEmoji], [setBlogPlaintext], [blogParser.default]]
		})
	]
};

export default config;
