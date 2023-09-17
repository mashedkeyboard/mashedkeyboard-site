import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools'
import { searchForWorkspaceRoot } from 'vite';
import { join } from 'path';

/** @type {import('vite').UserConfig} */
const wsRoot = searchForWorkspaceRoot(process.cwd());

const config = {
	plugins: [sveltekit(), imagetools()],
	server: {
		fs: {
		  allow: [
			join(wsRoot, 'posts'),
		  ],
		},
	  },
};

export default config;
