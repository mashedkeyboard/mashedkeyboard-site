import { error } from "@sveltejs/kit";
import { PUBLIC_HOSTNAME } from '$env/static/public';
import { mf2 } from 'microformats-parser';
import { VALID_WEBMENTION_TARGET_TYPE } from "$lib/blog/Webmention";

const TRUSTED_THIRD_PARTY_MICROFORMATS_SOURCES = ['brid.gy']

export const prerender = false;

export async function POST({ request, platform }) {
    const formData = await request.formData().catch(() => { throw error(400) });
    if (!(formData.has('source') && formData.has('target'))) throw error(400, 'webmentions must specify a source and target');

	const webmentions_store = platform?.env?.BLOG_WEBMENTIONS;
    if (!webmentions_store) throw error(500, 'no KV store found');

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
                || mfItem.properties.url?.some((url) => url == sourceUrl.toString())
                || TRUSTED_THIRD_PARTY_MICROFORMATS_SOURCES.includes(sourceUrl.hostname) && sourceUrl.protocol == 'https:'
            );
        });

        await generateSourceUrlHash(sourceUrl).then(async (hash) => {
            await webmentions_store.put(targetUrl.pathname.replace('/blog/', '') + '/mentions/' + hash, JSON.stringify({
                url: sourceUrl,
                mfItem: validItem,
                date: validItem && validItem.properties['dt-published'] ? new Date(validItem.properties['dt-published'][0].toString()) : new Date(),
                type: Object.values(VALID_WEBMENTION_TARGET_TYPE).filter((v) => Object.keys(validItem?.properties || {}).includes(v)) || 'link'
            }));
        });

        return new Response();
    }, (e) => {
        throw error(422, `source URL could not be reached: ${e}`);
    });
}

async function generateSourceUrlHash(sourceUrl: URL) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(sourceUrl.toString())).then((digestBuffer) => {
        // conversion code from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
        return Array.from(new Uint8Array(digestBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
    });
}