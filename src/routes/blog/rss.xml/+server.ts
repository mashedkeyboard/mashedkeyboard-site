import { loadPosts, sortPosts } from "$lib/blog/PostManager";
import { blogTitle } from "$lib/blog/Settings";
import { urlFor, urlForPost } from "$lib/Helpers";

export const prerender = true;

export async function GET({ fetch }) {
    // This function is expensive. That's okay, though! We prerender this, it's
    // not ever running live.
    // Design inspired by https://www.davidwparker.com/posts/how-to-make-an-rss-feed-in-sveltekit

    const posts = sortPosts(Object.values((await loadPosts()).slugs));

    const feed = `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="${urlFor('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
<title>Curtis Parfitt-Ford</title>
<description>${blogTitle}</description>
<lastBuildDate>${(new Date()).toUTCString()}</lastBuildDate>
<link>${urlFor('/blog')}</link>
<ttl>60</ttl>
${(await Promise.all(posts.slice(0, 10).map(async (post) => {
    let enclosure = '';
    const url = urlForPost(post);
    const image = post.getImage();
    if (image) {
        const imageData = await fetch(image.fallbackImage);
        const length = (await imageData.arrayBuffer()).byteLength;
        enclosure = `\n<enclosure url="${image.fallbackImage}" length="${length}" type="image/png" />`;
    }

    return `<item>
    <title>${post.getTitle()}</title>
    <comments>${url}/mentions</comments>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${post.getSummary()}</description>
    ${post.getTags().map((t) => `<category>${t}</category>`).join("\n")}
    <pubDate>${post.getDate().toUTCString()}</pubDate>${enclosure}
    </item>`;
}))).join("\n")}
</channel>
</rss>
`;

    return new Response(feed, { headers: {'Content-Type': 'application/xml'} });
};