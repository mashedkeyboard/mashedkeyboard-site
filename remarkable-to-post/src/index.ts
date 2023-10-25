import { readEml } from 'eml-parse-js';
import { lightFormat } from 'date-fns';
import slugify from 'slugify';

export interface Env {
	RECV_KEY: string;
	GITHUB_AUTH_TOKEN: string;
	BRANCH: string;
}

const hrRegex = /<\s*hr\s*\/?>/;
const bodyStartRegex = /<\s*body\s*>/;
const bodyEndRegex = /<\s*\/body\s*>/;
const fullBodyRegex = new RegExp(bodyStartRegex.source + '(.*?)' + bodyEndRegex.source, 'im');
const h1Regex = /<\s*h1\s*[^>]*>([^<]+)<\s*\/h1\s*>/;

async function htmlToFileForGitHub(html: string, env: Env, message?: ForwardableEmailMessage) {
	let h1 = '';
	let headers = '';
	let mainBodyHtml;
	let matchedContent = html.match(fullBodyRegex);
	if (matchedContent?.length != 2) {
		console.error('No body detected');
		message?.setReject('Failed to process due to HTML body error');
		return;
	}

	mainBodyHtml = matchedContent[1];

	if (html.match(hrRegex)) {
		// remove meta tags and other stuff that comes before our actual content
		// avoid matching up to br tags between lines of metadata
		headers = html.split(hrRegex, 2)[0].replace(/^(?:<[^>]*(?:(?:[^r\/\s]|[^b]r])\s*\/?)>\n?)+(?=\w+: )/m, '');
	}

	const h1match = mainBodyHtml.match(h1Regex);
	if (h1match) h1 = h1match[1];

	console.log('Detected headers: ', headers);
	console.log('Detected main body HTML: ', mainBodyHtml);
	console.log('Detected H1: ', h1);

	const parsedHeaders: {
		title?: string;
		date?: string;
		slug?: string;
		image?: string;
		imageAlt?: string;
		summary?: string;
	} = Object.fromEntries(
		headers.length
			? headers
					.split(/(?:<\s*br\s*\/?>|\n)+/)
					.flatMap((item) => {
						const returnedItems = [];

						item = item.trim();
						if (item.length) returnedItems.push(item.split(':').map((i) => i.trim()));

						return returnedItems;
					})
			: [],
	);

	console.log('Got parsedHeaders: ', JSON.stringify(parsedHeaders));

	const postTitle = parsedHeaders.title || h1 || 'Untitled';
	const postDate = parsedHeaders.date ? new Date(parsedHeaders.date) : new Date();
	const postSlug = parsedHeaders.slug || slugify(postTitle);

	const markdownHeader = `---
title: ${postTitle}
date: ${postDate.toISOString()}
${parsedHeaders.summary ? `summary: ${parsedHeaders.summary}` : ''}
${
	parsedHeaders.image
		? `image: ${parsedHeaders.image}
imageAlt: ${parsedHeaders.imageAlt}`
		: ''
}
---
`.replace(/^\s*\n/gm, '');

	console.log('Making request to GitHub');

	const req = new Request('https://api.github.com/repos/mashedkeyboard/mashedkeyboard-site/actions/workflows/create-post-from-remark-email.yml/dispatches', {
		headers: {
			Authorization: `Bearer ${env.GITHUB_AUTH_TOKEN}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		},
		method: 'POST',
		body: JSON.stringify({
			ref: env.BRANCH,
			inputs: {
				slug: postSlug,
				date: lightFormat(postDate, 'yyyy/MM/dd'),
				title: postTitle,
				frontmatter: markdownHeader,
				html: mainBodyHtml,
			}
		})
	});

	await fetch(req)
		.then(async (resp) => console.log('GitHub responded with ', resp.status, ': ', await resp.text()))
		.catch((e) => console.error('GitHub errored with ', e));
}

export default {
	async fetch(request: Request, env: Env) {
		htmlToFileForGitHub('<html><body>Debug Payload</body></html>', env);
		return new Response('OK');
	},

	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
		if (!message.to.includes(env.RECV_KEY) || !message.from.endsWith('@my.remarkable.com')) {
			console.error('Unknown address, rejecting');
			message.setReject('Unknown address');
			return;
		}

		return await new Promise<void>(async (res, rej) => {
			readEml(await new Response(message.raw).text(), async (err, emlJson) => {
				if (err) {
					console.error('Errored while parsing email: ', err);
					message.setReject('Failed to process due to email parsing error');
					rej(err);
					return;
				}

				const html = emlJson?.html;
				if (!html) {
					console.error('No parseable HTML detected, rejecting');
					message.setReject('No HTML');
					rej();
					return;
				}

				await htmlToFileForGitHub(html, env, message);
				res();
			});
		});
	},
};
