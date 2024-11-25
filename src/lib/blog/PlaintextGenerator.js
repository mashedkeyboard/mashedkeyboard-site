import { visit } from 'unist-util-visit';
import { toString as nodeToString } from 'mdast-util-to-string';

export default function setBlogPlaintext() {
	return async function transformer(
		/** @type {import('mdast').Root} */ tree,
		/** @type {import('vfile').VFile} */ vFile
	) {
		vFile.data.plaintext = '';

		visit(tree, 'text', (node) => {
			// @ts-ignore
			vFile.data.plaintext += nodeToString(node);
		});

		if (!vFile.data.fm) vFile.data.fm = {};
		// @ts-ignore
		vFile.data.fm.plaintext = vFile.data.plaintext;
	};
}
