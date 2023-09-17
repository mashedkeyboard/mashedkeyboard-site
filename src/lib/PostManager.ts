import { Post, type ImportedPostFile } from "./Post";

type PostCache = {[slug: string]: Post};

let posts: PostCache;

/**
 * loadPosts loads all the posts in the /posts/ directory into
 * a {@link PostCache} of materialised {@link Post}s.
 *
 * @return {Promise<PostCache>} the post cache
 */
async function loadPosts(): Promise<PostCache> {
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
 * getAllPosts gets all posts, sorted by sort order.
 *
 * @export
 * @return {Promise<Post[]>} the post array
 */
export async function getAllPosts(): Promise<Post[]> {
    return await loadPosts().then((posts) => Object.values(posts).sort((p1, p2) => p2.getSortOrder() - p1.getSortOrder()));
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