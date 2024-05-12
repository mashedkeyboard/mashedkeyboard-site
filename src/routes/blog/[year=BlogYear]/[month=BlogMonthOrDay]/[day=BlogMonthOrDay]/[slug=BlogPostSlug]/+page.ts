import { getPost } from '$lib/blog/PostManager.js';
import { resolveSlug } from './SlugResolver.js';
import { error } from '@sveltejs/kit';
import { urlFor } from '$lib/Helpers.js';
import type Status from 'tsl-mastodon-api/lib/JSON/Status';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return getPost(resolveSlug(params)).then(async (post) => {
        return {
            post: post,
            has_own_h1: true,
            meta_title: post.getTitle(),
            social_image: post.getImage()?.fallbackImage,
            description: post.getSummary(),
            open_graph_type: 'article',
            open_graph: {
                "article:author": urlFor(),
                "article:published_time": post.getDate().toISOString(),
            }
        };
    }).catch(() => { error(404, {message: 'No such post'}); } )
  }