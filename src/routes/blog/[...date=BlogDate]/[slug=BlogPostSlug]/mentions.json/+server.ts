import { error, json } from '@sveltejs/kit';
import { resolveSlug } from '../SlugResolver';
import type { Webmention } from '$lib/blog/Webmention';
import { dev } from '$app/environment';

export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function GET({ params, platform }) {
    const resolvedSlug = resolveSlug(params);
    let allMentions = [];

    const kvStore = platform?.env?.BLOG_WEBMENTIONS;
    if (kvStore) {
        let mentionKeys: {keys: [{name: string}], list_complete: boolean, cursor: string} | undefined;
        do {
            mentionKeys = await kvStore.list({ prefix: resolvedSlug + '/mentions', cursor: mentionKeys?.cursor });
            for (let key of mentionKeys?.keys || []) {
                allMentions.push(await kvStore.get(key.name, {type: "json"}) as Webmention);
            }
        } while (mentionKeys?.list_complete == false);
    } else {
        throw error(500, 'no KV store available');
    }

    return json(allMentions.sort((m1, m2) => m2.date > m1.date ? 1 : m2.date == m1.date ? 0 : -1));
  }