import { getPost } from '$lib/blog/PostManager.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return getPost(decodeURIComponent(params.date + '/' + params.slug)).then((post) => {
        return {
            post: post,
            meta_title: post.getTitle(),
            social_image: post.getImage()?.fallbackImage,
            description: post.getSummary(),
            open_graph_type: 'article',
            open_graph: {
                "article:author": "https://cpf.sh/",
                "article:published_time": post.getDate().toISOString(),
            }
        };
    }).catch(() => { throw error(404, {message: 'No such post'}) } )
  }