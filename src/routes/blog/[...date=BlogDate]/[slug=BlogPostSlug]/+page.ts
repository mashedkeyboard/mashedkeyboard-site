import { PUBLIC_HOSTNAME } from '$env/static/public';
import { getPost } from '$lib/blog/PostManager.js';
import { resolveSlug } from './SlugResolver.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return getPost(resolveSlug(params)).then((post) => {
        return {
            post: post,
            meta_title: post.getTitle(),
            social_image: post.getImage()?.fallbackImage,
            description: post.getSummary(),
            open_graph_type: 'article',
            open_graph: {
                "article:author": `https://${PUBLIC_HOSTNAME}/`,
                "article:published_time": post.getDate().toISOString(),
            }
        };
    }).catch(() => { throw error(404, {message: 'No such post'}) } )
  }