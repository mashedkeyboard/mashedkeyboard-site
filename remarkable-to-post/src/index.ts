import TurndownService from 'turndown';
import { Octokit } from '@octokit/core';
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
const h1Regex = /<\s*h1\s*[^>]*>((?:(?:[^<])|(?:<\s*em\s*[^>]*>[^<]+<\s*\/em\s*>))+)<\s*\/h1\s*>/;

async function htmlToFileForGitHub(html: string, env: Env, message?: ForwardableEmailMessage) {
	// Don't escape markdown: I want to write in it.
	TurndownService.prototype.escape = (x) => x;

	const turndownService = new TurndownService();

	console.log('Initialised Turndown');

	let h1 = '';
	let headers = '';
	let mainBodyHtml;
	let matchedContent = html.match(fullBodyRegex);
	if (matchedContent?.length != 2) {
		console.error('No body detected');
		message?.setReject('Failed to process due to HTML body error');
		return;
	}

	if (matchedContent[1].match(hrRegex)) {
		[headers, mainBodyHtml] = matchedContent[1].split(hrRegex, 2);
	} else {
		mainBodyHtml = matchedContent[1];
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
	} = Object.fromEntries(
		headers.length
			? headers
					.split(bodyEndRegex, 2)[1]
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

	console.log('Authenticating with Octokit...');

	const octokit = new Octokit({
		auth: env.GITHUB_AUTH_TOKEN,
	});

	console.log('Authenticated with Octokit');

	const postDate = parsedHeaders.date ? new Date(parsedHeaders.date) : new Date();
	const postSlug = parsedHeaders.slug || slugify(postTitle);

	const markdownHeader = `---
title: ${postTitle}
date: ${postDate.toISOString()}
${
	parsedHeaders.image
		? `image: ${parsedHeaders.image}
imageAlt: ${parsedHeaders.imageAlt}`
		: ''
}
---
`;

	console.log('Making request to GitHub');

	const resp = await octokit.request(
		'POST /repos/mashedkeyboard/mashedkeyboard-site/' + 'actions/workflows/create-post-from-remark-email/dispatches',
		{
			ref: env.BRANCH,
			inputs: {
				path: `${lightFormat(postDate, 'yyyy/MM/dd')}/${postSlug}.svx`,
				title: postTitle,
				frontmatter: markdownHeader,
				html: mainBodyHtml,
			},
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		},
	);

	console.log('GitHub responded with ', resp.status, ': ', resp.data);
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

		readEml(await new Response(message.raw).text(), async (err, emlJson) => {
			if (err) {
				console.error('Errored while parsing email: ', err);
				message.setReject('Failed to process due to email parsing error');
				return;
			}

			const html = emlJson?.html;
			if (!html) {
				console.error('No parseable HTML detected, rejecting');
				message.setReject('No HTML');
				return;
			}

			htmlToFileForGitHub(html, env, message);
		});
	},
};
