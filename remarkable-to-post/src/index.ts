import TurndownService from 'turndown';
import { Octokit } from "@octokit/core";
import { simpleParser } from 'mailparser';
import { Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import { lightFormat } from 'date-fns';
import slugify from 'slugify';

export interface Env {
	RECV_KEY: string;
	GITHUB_AUTH_TOKEN: string;
	BRANCH: string;
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
		if (!message.to.includes(env.RECV_KEY) || !message.from.endsWith('@my.remarkable.com')) {
			console.error("Unknown address, rejecting");
			message.setReject("Unknown address");
			return;
		}

		simpleParser(Readable.fromWeb(message.raw as ReadableStream)).then(async (parsed) => {
			if (!parsed.html) {
				console.error("No parseable HTML detected, rejecting");
				message.setReject("No HTML");
				return;
			}

			// Don't escape markdown: I want to write in it.
			TurndownService.prototype.escape = (x) => x;

			const turndownService = new TurndownService();

			console.log("Initialised Turndown");

			const [headers, mainBodyHtml] = parsed.html.split(/<\s*hr\s*\/?>/, 2);

			console.log("Detected headers: ", headers);

			const h1 = new DOMParser().parseFromString(mainBodyHtml, "text/html").querySelector("h1")?.innerHTML;

			turndownService.remove('h1');

			const mainMarkdown = turndownService.turndown(mainBodyHtml.split(/<\s*\/body\s*>/, 1)[0]);

			const parsedHeaders: {
				title?: string,
				date?: string,
				slug?: string,
				image?: string,
				imageAlt?: string
			} = Object.fromEntries(headers.split(/<\s*body\s*>/, 2)[1].split(/(?:<\s*br\s*\/?>|\n)+/).flatMap((item) => {
				const returnedItems = [];
				
				item = item.trim();
				if (item.length) returnedItems.push(item.split(":").map((i) => i.trim()));

				return returnedItems;
			}))

			const postTitle = parsedHeaders.title || h1 || "Untitled";

			const octokit = new Octokit({
				auth: env.GITHUB_AUTH_TOKEN
			})

			const postDate = parsedHeaders.date ? new Date(parsedHeaders.date) : new Date()
			const postSlug = parsedHeaders.slug || slugify(postTitle)

			const markdown = `---
title: ${postTitle}
date: ${postDate.toISOString()}
${parsedHeaders.image ? `image: ${parsedHeaders.image}
imageAlt: ${parsedHeaders.imageAlt}` : ''}
---
${mainMarkdown}`

			console.log("Making request to GitHub");

			const resp = await octokit.request('POST /repos/mashedkeyboard/mashedkeyboard-site/' + 
								'actions/workflows/create-post-from-remark-email/dispatches', {
				ref: env.BRANCH,
				inputs: {
					path: `${lightFormat(postDate, 'yyyy/MM/dd')}/${postSlug}.svx`,
					title: postTitle,
					markdown: markdown
				},
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});

			console.log("GitHub responded with ", resp.status, ": ", resp.data)
		});
	}
};