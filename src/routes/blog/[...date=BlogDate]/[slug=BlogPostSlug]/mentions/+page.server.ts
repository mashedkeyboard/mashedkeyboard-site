import { error, json } from '@sveltejs/kit';
import { resolveSlug } from '../SlugResolver';
import type { Webmention } from '$lib/blog/Webmention';
import { dev } from '$app/environment';
import { getPost } from '$lib/blog/PostManager';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    return {
        mentions: (await (await fetch(`/blog/${resolveSlug(params)}/mentions.json`)).json()),
        postName: (await getPost(resolveSlug(params))).getTitle()
    }
}