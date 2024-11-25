import { visit } from 'unist-util-visit';
import toCamel from 'just-camel-case';
// All these local imports need to be .js for the sake of ts-import
// because they're being imported into svelte.config.js, which is
// JS-only :(
import type { ParserResult } from './ParserResult.js';
import type { VFile } from 'vfile';
import type { Root } from 'mdast';
import { addToots } from './parsers/Toots.js';
import { addOpenGraphLinks } from './parsers/OpenGraphLinks.js';

/**
 * This plugin builds upon brilliant work from pngwn and mattjennings on GitHub.
 * Thanks to both of them!
 */

const modules: BlogParser[] = [addToots, addOpenGraphLinks];

export const GENERATED_IMAGES = {
	avifSrcsetImage: generateSrcsetQueryForFormat('avif'),
	webpSrcsetImage: generateSrcsetQueryForFormat('webp'),
	fallbackImage: 'w=700&format=png'
};

/**
 * @param {string} format the desired format
 */
function generateSrcsetQueryForFormat(format: string) {
	return `w=500;900;1200&format=${format}&as=srcset`;
}

// regexes taken from https://github.com/pngwn/MDsveX/blob/master/packages/mdsvex/src/transformers/index.ts#L106,
// with many grateful thanks for MDsveX!
const attrs = `(?:\\s{0,1}[a-zA-z]+=(?:"){0,1}[a-zA-Z0-9]+(?:"){0,1})*`;
const context = `(?:\\s{0,1}context)=(?:"){0,1}module(?:"){0,1}`;
const RE_MODULE_SCRIPT = new RegExp(`^(<script` + attrs + context + attrs + `>)`);
const RE_SCRIPT_START =
	/<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;
const RE_SRC = /src\s*=\s*"(.+?)"/;

export default function remark() {
	return async function transformer(tree: Root, vFile: VFile) {
		const urls = new Map();
		const url_count = new Map();

		/**
		 * @param {string} url the image URL to transform
		 */
		function transformUrl(url: string) {
			if (url.startsWith('.')) {
				let camel = toCamel(url);
				const count = url_count.get(camel);
				const dupe = urls.get(url);

				if (count && !dupe) {
					url_count.set(camel, count + 1);
					camel = `${camel}_${count}`;
				} else if (!dupe) {
					url_count.set(camel, 1);
				}

				urls.set(url, {
					path: url,
					id: camel
				});

				return `{${camel}}`;
			}

			return url;
		}

		// transform urls in images
		visit(tree, 'image', (node) => {
			node.url = transformUrl(node.url);
		});

		// transform src in html nodes
		visit(tree, 'html', (node) => {
			if (node.value) {
				const [, url] = node.value.match(RE_SRC) ?? [];
				if (url) {
					const transformed = transformUrl(url);
					node.value = node.value.replace(`"${url}"`, transformed);
				}
			}
		});

		// add imports _and_ exports for metadata images
		const typedFrontmatterData = vFile.data.fm as { image?: string; imageAlt?: string };
		const image = typedFrontmatterData?.image;
		if (image) {
			Object.entries(GENERATED_IMAGES).forEach(([key, query]) => {
				const urlWithQuery = `./${image}?${query}`;
				urls.set(urlWithQuery, {
					path: urlWithQuery,
					id: key
				});
			});
		}

		let scripts = '';
		urls.forEach((x) => (scripts += `import ${x.id} from "${x.path}";\n`));

		for (const mod of modules) {
			scripts += (await mod(tree, vFile)).scripts.join('\n');
		}

		let is_script = false;

		visit(tree, 'html', (node) => {
			if (RE_SCRIPT_START.test(node.value)) {
				is_script = true;
				node.value = node.value.replace(RE_SCRIPT_START, (/** @type {string} */ script: any) => {
					return `${script}\n${scripts}\n`;
				});
			}
		});

		if (!is_script) {
			tree.children.push({
				type: 'html',
				value: `<script>\n${scripts}</script>`
			});
		}

		if (image) {
			const exportedImages = `export let images = {
            ${Object.keys(GENERATED_IMAGES)
							.map((key) => `${key}: ${key}`)
							.join(',\n')},
            alt: ${JSON.stringify(typedFrontmatterData?.imageAlt)}
        };`;

			let has_module_script = false;

			visit(tree, 'html', (node) => {
				if (RE_MODULE_SCRIPT.test(node.value)) {
					node.value = node.value.replace(RE_MODULE_SCRIPT, (/** @type {string} */ script: any) => {
						return `${script}\n${exportedImages}`;
					});
				}
			});

			if (!has_module_script) {
				tree.children.push({
					type: 'html',
					value: `<script context="module">\n${exportedImages}</script>`
				});
			}
		}
	};
}

export type BlogParser = (tree: Root, vFile: VFile) => Promise<ParserResult>;
