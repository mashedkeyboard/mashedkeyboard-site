import { getAllPostMetadata } from '$lib/blog/PostManager';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        posts: await getAllPostMetadata().then((postMeta) => JSON.stringify(postMeta)),
        meta_title: "Thoughts on tech and society: Curtis Parfitt-Ford"
    };
  }