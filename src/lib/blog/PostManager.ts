import { explodeSlug, type FullURLSlugString } from './SlugResolver';
import { Post, type ImportedPostFile } from './Post';
import type { PostMetadata } from './PostMetadata';

export type PostCache = {
	slugs: { [slug: string]: Post };
	tags: { [tag: string]: Post[] };
	isFilled: boolean;
};

let posts: PostCache = { slugs: {}, tags: {}, isFilled: false };

/**
 * loadPosts loads all the posts in the /posts/ directory into
 * a {@link PostCache} of materialised {@link Post}s.
 *
 * @return {Promise<PostCache>} the post cache
 */
export async function loadPosts(): Promise<PostCache> {
	const modules = import.meta.glob('/posts/*/**/*.svx');
	if (!posts.isFilled) {
		await Promise.all(
			Object.entries(modules).map(async (moduleEntry) => {
				return new Promise<Record<string, Post>>((res) => {
					moduleEntry[1]().then(async (importedFile) => {
						const typedImportedFile: ImportedPostFile = importedFile as ImportedPostFile;
						const slug = moduleEntry[0].slice(7, -4);
						const post = await Post.fromModule(slug, typedImportedFile);

						for (const tag of post.getTags()) {
							const normalisedTag = tag.toLowerCase();
							posts.tags[normalisedTag] ||= [];
							posts.tags[normalisedTag].push(post);
						}

						res({ [slug]: post });
					});
				});
			})
		).then((records) => {
			posts.slugs = Object.assign({}, ...records);
			posts.isFilled = true;
		});
	}

	return new Promise((res) => res(posts));
}

/**
 * getAllPostMetadata gets all post metadata, sorted by sort order.
 *
 * @export
 * @return {Promise<PostMetadata[]>} the post metadata array
 */
export async function getAllPostMetadata(): Promise<PostMetadata[]> {
	/**
	 * This is really awkward, dehydrating here again, rather than just not hydrating to start with.
	 * Unfortunately, getting dynamic imports working without this hacky workaround wasn't looking possible -
	 * at least, as of September 2023.
	 */
	return await loadPosts().then((posts) => postsToMeta(Object.values(posts.slugs)));
}

/**
 * getPost gets an individual materialised {@link Post} from
 * a given slug.
 *
 * @export
 * @param {FullURLSlugString} slug the slug of the post to retrieve
 * @return {Promise<Post>} the post, or a promise rejection if there was no such post
 */
export async function getPost(slug: FullURLSlugString): Promise<Post> {
	if (posts.slugs[slug]) return posts.slugs[slug];

	const slugArray = explodeSlug(slug);

	try {
		// the relative and weird pre-split path here is required by virtue of
		// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
		const typedImportedFile = (await import(
			`../../../posts/${slugArray[0]}/${slugArray[1]}/${slugArray[2]}/${slugArray[3]}.svx`
		)) as ImportedPostFile;
		return Post.fromModule(slug, typedImportedFile);
	} catch (e) {
		throw new Error('No such post');
	}
}

/**
 * getTaggedPosts gets a list of {@link Post}s from
 * a given tag that those posts contain.
 *
 * @export
 * @param {string} tag the tag to retrieve
 * @return {Promise<Post[]>} the metadata of the posts for the tag, or a promise rejection if there was no such post
 */
export async function getTaggedPosts(tag: string): Promise<PostMetadata[]> {
	const normalisedTag = tag.toLowerCase();
	return await loadPosts().then(
		(posts) =>
			new Promise((res, rej) =>
				posts.tags[normalisedTag] ? res(postsToMeta(posts.tags[normalisedTag])) : rej('No such tag')
			)
	);
}

/**
 * Sorts posts by their sort order.
 *
 * @export
 * @param {Post[]} posts an array of posts
 * @return {Post[]} the same array sorted
 */
export function sortPosts(posts: Post[]) {
	return posts.sort((p1, p2) => p2.getSortOrder() - p1.getSortOrder());
}

/**
 * postsToMeta takes an array of {@link Post}s and
 * turns them into metadata for those posts.
 *
 * @param {Post[]} posts the post to convert
 * @return {PostMetadata[]} the corresponding metadata
 */
function postsToMeta(posts: Post[]): PostMetadata[] {
	return sortPosts(posts).map((post) => post.getMetadata());
}
