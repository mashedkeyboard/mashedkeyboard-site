import { PUBLIC_HOSTNAME } from '$env/static/public';
import type { Post } from './blog/Post';

/**
 * urlFor gets the full URL to a path, or to the root
 * if no path is specified. No-op if the provided path
 * is already a URL.
 *
 * @export
 * @param {string} [pathOrUrl=''] the path to get the URL for: defaults to the root
 * @return {string} the full URL
 */
export function urlFor(pathOrUrl: string = '') {
	return pathOrUrl.match(/^https?:\/\//)
		? pathOrUrl
		: `https://${PUBLIC_HOSTNAME}/${pathOrUrl.replace(/^\//, '')}`;
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
