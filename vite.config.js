import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { searchForWorkspaceRoot } from 'vite';
import { join } from 'path';

const wsRoot = searchForWorkspaceRoot(process.cwd());

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), imagetools()],
	server: {
		fs: {
			allow: [join(wsRoot, 'posts')]
		}
	},
	build: {
		sourcemap: true
	}
};

export default config;
