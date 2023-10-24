import { error, json } from '@sveltejs/kit';
import { resolveSlug } from '../SlugResolver';
import type { Webmention } from '$lib/blog/Webmention';
import { dev } from '$app/environment';
import { getPost } from '$lib/blog/PostManager';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const post = await getPost(resolveSlug(params));
    return {
        meta_title: `Mentions: ${post.getTitle()}`,
        mentions: (await (await fetch(`/blog/${resolveSlug(params)}/mentions.json`)).json()),
        postName: post.getTitle(),
        postMastoUrl: post.getMastodonPost()
    }
}