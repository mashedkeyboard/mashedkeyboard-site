import { getAllPostMetadata } from '$lib/blog/PostManager';
import { blogTitle } from '$lib/blog/Settings';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		posts: await getAllPostMetadata().then((postMeta) => JSON.stringify(postMeta)),
		meta_title: `${blogTitle}: Curtis Parfitt-Ford`,
		has_own_h1: true,
		description:
			"A collection of Curtis Parfitt-Ford's thoughts on tech and society. No promises as to how often it's updated, but hopefully vaguely interesting when it is."
	};
}
