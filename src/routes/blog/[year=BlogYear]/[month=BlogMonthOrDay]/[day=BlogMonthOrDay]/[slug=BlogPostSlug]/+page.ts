import { getPost } from '$lib/blog/PostManager.js';
import { resolveSlug } from './SlugResolver.js';
import { error } from '@sveltejs/kit';
import { urlFor } from '$lib/Helpers.js';
import type Status from 'tsl-mastodon-api/lib/JSON/Status';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return getPost(resolveSlug(params)).then(async (post) => {
        let tootsMap;

        const toots = post.getToots();
        if (toots) {
            tootsMap = new Map(await Promise.all(toots.map((tootUrl) => {
                return new Promise<[string, Status]>(async (res) => {
                    const urlObject = new URL(tootUrl);
                    const pathParts = urlObject.pathname.split('/');
    
                    const fetchedPost = await fetch(
                        `${urlObject.origin}/api/v1/statuses/${pathParts[pathParts.length - 1]}`, {
                        headers: {
                            "User-Agent": "site-masto-fetcher@cpf.sh"
                        }
                    });
    
                    res([tootUrl, await fetchedPost.json() as Status]);
                })
            })));
        }

        return {
            post: post,
            has_own_h1: true,
            meta_title: post.getTitle(),
            social_image: post.getImage()?.fallbackImage,
            description: post.getSummary(),
            toots: tootsMap || new Map(),
            open_graph_type: 'article',
            open_graph: {
                "article:author": urlFor(),
                "article:published_time": post.getDate().toISOString(),
            }
        };
    }).catch(() => { throw error(404, {message: 'No such post'}) } )
  }