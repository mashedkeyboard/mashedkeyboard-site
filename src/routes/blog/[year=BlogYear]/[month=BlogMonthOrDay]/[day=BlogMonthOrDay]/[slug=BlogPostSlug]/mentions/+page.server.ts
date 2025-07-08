import { resolveSlug } from '$lib/blog/SlugResolver';
import { getPost } from '$lib/blog/PostManager';
import { urlForPost } from '$lib/Helpers';
import { GET as getMentionsJson } from '../mentions.json/+server.js';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, platform }) {
	const post = await getPost(resolveSlug(params));
	return {
		meta_title: `Mentions: ${post.getTitle()}`,
		has_own_h1: true,
		mentions: await (await getMentionsJson({ params, platform })).json(),
		postName: post.getTitle(),
		postUrl: urlForPost(post),
		postMastoUrl: post.getMastodonPost(),
		noindex: true,
		description: `What people have been saying about "${post.getTitle()}" by Curtis Parfitt-Ford.`
	};
}
