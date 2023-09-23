import { Post, type ImportedPostFile } from "./Post";
import type { PostMetadata } from "./PostMetadata";

export type PostCache = {[slug: string]: Post};

let posts: PostCache;

/**
 * loadPosts loads all the posts in the /posts/ directory into
 * a {@link PostCache} of materialised {@link Post}s.
 *
 * @return {Promise<PostCache>} the post cache
 */
export async function loadPosts(): Promise<PostCache> {
    const modules = import.meta.glob('/posts/*/**/*.svx');
    if (!posts?.length) {
        await Promise.all(Object.entries(modules).map(async (moduleEntry) => {
            return new Promise<Record<string, Post>>((res) => {
                moduleEntry[1]().then(async (importedFile) => {
                    const typedImportedFile: ImportedPostFile = importedFile as ImportedPostFile;
                    const slug = moduleEntry[0].slice(7, -4);
                    res({[slug]: await Post.fromModule(slug, typedImportedFile)});
                })
            });
        })).then((records) => {
            posts = Object.assign({}, ...records);
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
    return await loadPosts().then((posts) => Object.values(posts).sort((p1, p2) => p2.getSortOrder() - p1.getSortOrder()).map((post) => post.getMetadata()));
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
    return await loadPosts().then((posts) => new Promise((res, rej) => posts[slug] ? res(posts[slug]) : rej('No such post')));
}