import { getTaggedPosts } from '$lib/blog/PostManager';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const posts = await getTaggedPosts(params.tag).catch(() => false);
    return {
        tag: params.tag,
        posts: JSON.stringify(posts),
        meta_title: `Posts tagged ${params.tag}: Curtis Parfitt-Ford`
    };
  }