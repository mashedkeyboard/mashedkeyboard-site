import { error } from "@sveltejs/kit";
import { PUBLIC_HOSTNAME } from '$env/static/public';
import { mf2 } from 'microformats-parser';
import { VALID_WEBMENTION_TARGET_TYPE } from "$lib/blog/Webmention";
import { getCustomCache } from "$lib/Cache";
import { urlFor } from "$lib/Helpers";

const TRUSTED_THIRD_PARTY_MICROFORMATS_SOURCES = ['brid.gy']

export const prerender = false;

export async function POST({ request, platform }) {
    const formData = await request.formData().catch(() => { throw error(400) });
    if (!(formData.has('source') && formData.has('target'))) throw error(400, 'webmentions must specify a source and target');

	const db = platform?.env?.BLOGDB;
    if (!db) throw error(500, 'no db found');

    const customCache = await getCustomCache(platform?.caches);

    const sourceUrl = new URL(formData.get('source')!.toString());
    const targetUrl = new URL(formData.get('target')!.toString());

    if (targetUrl.hostname !== PUBLIC_HOSTNAME) throw error(400, `that doesn't look like a webmention for ${PUBLIC_HOSTNAME}`);
    if (targetUrl == sourceUrl) throw error(400, "a page can't mention itself!");

    const matchesTarget = (urlString: string) => urlString == targetUrl.toString();
    const fetchAbortController = new AbortController();
    setTimeout(() => fetchAbortController.abort(), 5000);

    return await fetch(sourceUrl, {headers: {accept: 'text/html'}, signal: fetchAbortController.signal}).then(async (response) => {
        if (response.status !== 200) throw error(422, 'source URL returned a non-200 status code');

        const responseText = await response.text();

        const containsLink = responseText.includes(targetUrl.toString());

        if (!containsLink) throw error(422, 'URL did not appear to have valid reference to this target');
        
        const mf2Items = mf2(responseText, {baseUrl: sourceUrl.toString()}).items;
        
        const validItem = mf2Items.find((mfItem) => {
            return Object.entries(mfItem.properties).some(([propName, property]) => {
                return Object.values(VALID_WEBMENTION_TARGET_TYPE).includes(propName as VALID_WEBMENTION_TARGET_TYPE) && property.map((prop) => prop.toString()).some(matchesTarget)
            }) && (
                mfItem.properties.url == null
                || mfItem.properties.url?.some((url: string) => url == sourceUrl.toString())
                || TRUSTED_THIRD_PARTY_MICROFORMATS_SOURCES.includes(sourceUrl.hostname) && sourceUrl.protocol == 'https:'
            );
        });

        const resolvedSlug = targetUrl.pathname.replace('/blog/', '');
        const date = validItem && validItem.properties['dt-published'] ? new Date(validItem.properties['dt-published'][0].toString()) : new Date();
        const foundTypes = Object.values(VALID_WEBMENTION_TARGET_TYPE).filter((v) => Object.keys(validItem?.properties || {}).includes(v));
        const {
            success,
            error: dbErr
        } = await db.prepare("insert into mentions(slug, url, date, type, mfItem) values (?, ?, ?, ?, ?);")
                    .bind(
                            resolvedSlug,
                            sourceUrl.toString(),
                            date.toISOString(),
                            foundTypes.length ? foundTypes.join() : 'link',
                            JSON.stringify(validItem) || null
                         )
                    .run();

        if (success) {
            const resolvedUrl = urlFor(`blog/${resolvedSlug}/mentions.json`);
            if (customCache && platform.context?.waitUntil) {
                platform.context.waitUntil(customCache.delete(resolvedUrl));
            }

            return new Response();
        } else {
            throw error(500, dbErr);
        }
    }, (e) => {
        throw error(422, `source URL could not be reached: ${e}`);
    });
}