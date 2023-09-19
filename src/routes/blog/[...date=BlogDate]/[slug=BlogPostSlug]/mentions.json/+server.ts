import { error, json } from '@sveltejs/kit';
import { resolveSlug } from '../SlugResolver';
import type { Webmention } from '$lib/blog/Webmention';
import { dev } from '$app/environment';
import { PUBLIC_HOSTNAME } from '$env/static/public';

// Redeploy on update
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function GET({ params, platform }) {
  const resolvedSlug = resolveSlug(params);
  const normalisedUrl = `https://${PUBLIC_HOSTNAME}/blog/${resolvedSlug}/mentions.json`;
  let allMentions = [];

  const kvStore = platform?.env?.BLOG_WEBMENTIONS;

  if (kvStore) {
    let mentionKeys: { keys: [{ name: string }], list_complete: boolean, cursor: string } | undefined;
    do {
      mentionKeys = await kvStore.list({ prefix: resolvedSlug + '/mentions', cursor: mentionKeys?.cursor });
      for (let key of mentionKeys?.keys || []) {
        allMentions.push(await kvStore.get(key.name, { type: "json" }) as Webmention);
      }
    } while (mentionKeys?.list_complete == false);
  } else {
    throw error(500, 'no KV store available');
  }

  let mentionsSet = new Set<Webmention>(allMentions);
  let mentionsUrls: { [url: string]: Webmention } = Object.fromEntries(allMentions.map((mention) => [mention.mfItem?.properties?.url || mention.url, mention]));

  mentionsSet.forEach((mention) => {
    const inReplyTo = mention.mfItem?.properties?.["in-reply-to"];
    if (inReplyTo) {
      for (let replyUrl of inReplyTo) {
        if (mentionsUrls[replyUrl.toString()]) {
          const replyToMention = mentionsUrls[replyUrl.toString()];
          replyToMention.replies ||= [];
          replyToMention.replies.push(mention);
          mentionsSet.delete(mention);
        }
      }
    }
  })

  return json(Array.from(mentionsSet).sort((m1, m2) => m2.date > m1.date ? 1 : m2.date == m1.date ? 0 : -1));
}