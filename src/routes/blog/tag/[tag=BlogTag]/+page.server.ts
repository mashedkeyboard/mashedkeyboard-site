import { getTaggedPosts } from '$lib/blog/PostManager';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const posts = await getTaggedPosts(params.tag).catch(() => false);
	return {
		tag: params.tag,
		posts: JSON.stringify(posts),
		has_own_h1: true,
		meta_title: `Posts tagged ${params.tag}: Curtis Parfitt-Ford`,
		description: `All the posts on Curtis' blog that've been tagged with ${params.tag}.`
	};
}
