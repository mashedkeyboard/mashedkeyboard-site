import { resolveSlug } from '../SlugResolver';
import { getPost } from '$lib/blog/PostManager';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const post = await getPost(resolveSlug(params));
    return {
        meta_title: `Mentions: ${post.getTitle()}`,
        has_own_h1: true,
        mentions: (await (await fetch(`/blog/${resolveSlug(params)}/mentions.json`)).json()),
        postName: post.getTitle(),
        postMastoUrl: post.getMastodonPost(),
        noindex: true,
        description: `What people have been saying about "${post.getTitle()}" by Curtis Parfitt-Ford.`
    }
}