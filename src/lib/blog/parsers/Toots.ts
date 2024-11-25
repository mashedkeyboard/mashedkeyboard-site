import { visit } from 'unist-util-visit';
import type { Html, Root } from 'mdast';
import { ParserResult } from '../ParserResult.js';
import { encodeHTML } from 'entities';

const RE_TOOT = /<Toot>[\s\n]*([^<]+)[\s\n]*<\/Toot>/g;

export async function addToots(tree: Root): Promise<ParserResult> {
	const nodesToReplace: Html[] = [];
	let hasToots = false;
	const result = new ParserResult();

	// add toot markup
	visit(tree, 'html', (node) => {
		nodesToReplace.push(node);
	});

	/**
	 * async replace from https://stackoverflow.com/a/73891404
	 * @param {string} string
	 * @param {RegExp} regexp
	 * @param {any} replacerFunction
	 */
	async function replaceAsync(
		string: string,
		regexp: RegExp,
		replacerFunction: (_: any, url: string) => Promise<string>
	) {
		const replacements = await Promise.all(
			Array.from(
				string.matchAll(regexp),
				// @ts-ignore
				(match) => replacerFunction(...match)
			)
		);
		let i = 0;
		return string.replace(regexp, () => replacements[i++]);
	}

	for (const node of nodesToReplace) {
		node.value = await replaceAsync(node.value, RE_TOOT, async (_: any, url: string) => {
			if (!hasToots) {
				result.scripts.push(`import Toot from '$lib/components/Toot.svelte';`);

				hasToots = true;
			}

			const urlObject = new URL(url);
			const pathParts = urlObject.pathname.split('/');

			const fetchedPost = await fetch(
				`${urlObject.origin}/api/v1/statuses/${pathParts[pathParts.length - 1]}`,
				{
					headers: {
						'User-Agent': 'site-masto-fetcher@cpf.sh'
					}
				}
			);

			return `<Toot status="${encodeHTML(await fetchedPost.text())}" />`;
		});
	}

	return result;
}
