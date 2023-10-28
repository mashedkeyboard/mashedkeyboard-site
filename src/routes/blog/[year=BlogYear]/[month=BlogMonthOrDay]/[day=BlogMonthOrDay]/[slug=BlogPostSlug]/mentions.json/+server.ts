import { error, json } from '@sveltejs/kit';
import { resolveSlug } from '../SlugResolver';
import type { Webmention } from '$lib/blog/Webmention';
import { getCustomCache } from '$lib/Cache';
import { urlFor } from '$lib/Helpers';

export const prerender = false;

const CACHE_CONTROL = 'Cache-Control';
const WEB_MAX_AGE = 'public, max-age=60, stale-while-revalidate=30'
const CDN_CACHE_CONTROL = 'CDN-Cache-Control';
const CLOUDFLARE_MAX_AGE = 'max-age=604800';

/** @type {import('./$types').PageServerLoad} */
export async function GET({ params, platform }) {
	console.log("fetch called for mentions endpoint");
	const resolvedSlug = resolveSlug(params);

	const normalisedUrl = urlFor(`blog/${resolvedSlug}/mentions.json`);
	let allMentions: Webmention[] = [];

	const db = platform?.env?.BLOGDB;
	const cache = await getCustomCache(platform?.caches);

	if (db && cache) {
		console.log(normalisedUrl);
		const cachedResponse = await cache.match(normalisedUrl);
		if (cachedResponse) {
      		const response = new Response(cachedResponse.body, cachedResponse);

			console.log(JSON.stringify(response.headers));

			return response;
		} else {
			console.log('No response in cache');
		}
		const { results } = await db
			.prepare('SELECT url, date, type, mfItem FROM mentions WHERE slug = ?')
			.bind(resolvedSlug)
			.all<Omit<Webmention, 'mfItem'> & {mfItem: string}>();

		allMentions = results.map((res) => {
		return {
			...res,
			mfItem: JSON.parse(res.mfItem)
		} as Webmention;
		})
	} else {
		throw error(500, 'no db found');
	}

	let mentionsSet = new Set(allMentions);
	let mentionsUrls = Object.fromEntries(
		allMentions.map((mention) => [mention.mfItem?.properties?.url || mention.url, mention])
	);

	mentionsSet.forEach((mention) => {
		const inReplyTo = mention.mfItem?.properties?.['in-reply-to'];
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
	});

	const resp: Response = json(
		Array.from(mentionsSet).sort((m1, m2) => (m2.date > m1.date ? 1 : m2.date == m1.date ? 0 : -1))
	);

	resp.headers.set(CACHE_CONTROL, WEB_MAX_AGE);
	resp.headers.append(CDN_CACHE_CONTROL, CLOUDFLARE_MAX_AGE);

	if (cache && platform.context?.waitUntil) {
		// we can't just use a new response with the same body here,
		// because SvelteKit then gets "readablestream locked to a
		// reader" errors.
		const cacheResp = resp.clone();
		console.log("storing in cache");
		platform.context.waitUntil(cache.put(normalisedUrl, cacheResp));
	}

	console.log("end return resp");
	return resp;
}
