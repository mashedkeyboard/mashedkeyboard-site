import { getAllPostMetadata } from '$lib/blog/PostManager';
import { blogTitle } from '$lib/blog/Settings';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        posts: await getAllPostMetadata().then((postMeta) => JSON.stringify(postMeta)),
        meta_title: `${blogTitle}: Curtis Parfitt-Ford`
    };
  }