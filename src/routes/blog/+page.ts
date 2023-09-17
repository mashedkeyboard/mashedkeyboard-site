import { getAllPosts } from '$lib/PostManager.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
    return {
        posts: await getAllPosts(),
        meta_title: "Thoughts on tech and society: Curtis Parfitt-Ford"
    };
  }