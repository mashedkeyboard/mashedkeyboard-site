import { PUBLIC_HOSTNAME } from "$env/static/public";
import type { Post } from "./blog/Post";

/**
 * urlFor gets the full URL to a path, or to the root
 * if no path is specified.
 *
 * @export
 * @param {string} [path=''] the path to get the URL for: defaults to the root
 * @return {string} the full URL
 */
export function urlFor(path: string = '') {
    return `https://${PUBLIC_HOSTNAME}/${path.replace(/^\//, '')}`;
}

/**
 * urlForPost gets the full URL of a {@link Post}
 *
 * @export
 * @param {Post} post the post to get the URL for
 * @return {string} the full URL
 */
export function urlForPost(post: Post) {
    return urlFor(`blog/${post.getSlug()}`);
}