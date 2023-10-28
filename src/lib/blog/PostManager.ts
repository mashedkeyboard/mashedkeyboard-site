import { Post, type ImportedPostFile } from "./Post";
import type { PostMetadata } from "./PostMetadata";

export type PostCache = {
    slugs: {[slug: string]: Post},
    tags: {[tag: string]: Post[]},
    isFilled: boolean;
};

let posts: PostCache = {slugs: {}, tags: {}, isFilled: false};

/**
 * loadPosts loads all the posts in the /posts/ directory into
 * a {@link PostCache} of materialised {@link Post}s.
 *
 * @return {Promise<PostCache>} the post cache
 */
export async function loadPosts(): Promise<PostCache> {
    const modules = import.meta.glob('/posts/*/**/*.svx');
    if (!posts.isFilled) {
        await Promise.all(Object.entries(modules).map(async (moduleEntry) => {
            return new Promise<Record<string, Post>>((res) => {
                moduleEntry[1]().then(async (importedFile) => {
                    const typedImportedFile: ImportedPostFile = importedFile as ImportedPostFile;
                    const slug = moduleEntry[0].slice(7, -4);
                    const post = await Post.fromModule(slug, typedImportedFile);

                    for (const tag of post.getTags()) {
                        posts.tags[tag] ||= [];
                        posts.tags[tag].push(post);
                    }

                    res({[slug]: post});
                })
            });
        })).then((records) => {
            posts.slugs = Object.assign({}, ...records);
            posts.isFilled = true;
        })
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
 * @param {string} slug the slug of the post to retrieve
 * @return {Promise<Post>} the post, or a promise rejection if there was no such post
 */
export async function getPost(slug: string): Promise<Post> {
    return await loadPosts().then((posts) => new Promise((res, rej) => posts.slugs[slug] ? res(posts.slugs[slug]) : rej('No such post')));
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
    return await loadPosts().then((posts) => new Promise((res, rej) => posts.tags[tag] ? res(postsToMeta(posts.tags[tag])) : rej('No such tag')));
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