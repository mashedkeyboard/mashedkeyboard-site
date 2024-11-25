import { visit } from 'unist-util-visit';
import type { Link, Paragraph, Root } from 'mdast';
import { ParserResult } from '../ParserResult.js';
import ogs from 'open-graph-scraper';
import { encodeHTML } from 'entities';

export async function addOpenGraphLinks(tree: Root): Promise<ParserResult> {
	const result = new ParserResult();
	let hasOpenGraphLink = false;
	const linkParas: Paragraph[] = [];

	visit(tree, 'paragraph', (node) => {
		if (node.children.length > 0 && node.children.length <= 2 && node.children[0].type === 'link') {
			linkParas.push(node);
		}
	});

	for (const linkPara of linkParas) {
		const url = (linkPara.children[0] as Link).url;
		await ogs({ url }).then((data) => {
			if (data.result.success) {
				if (!hasOpenGraphLink) {
					result.scripts.push(`import OpenGraphLink from '$lib/components/OpenGraphLink.svelte';`);

					hasOpenGraphLink = true;
				}

				let alt;

				if (linkPara.children[1] && linkPara.children[1].type == 'text') {
					alt = linkPara.children[1].value.trim();
				}

				linkPara.children = [
					{
						type: 'html',
						value: `<OpenGraphLink data="${encodeHTML(JSON.stringify(data.result))}" ${
							alt ? `alt="${alt}"` : ''
						} />`
					}
				];
			}
		});
	}

	return result;
}
