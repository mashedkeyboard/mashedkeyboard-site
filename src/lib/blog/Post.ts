import type { SvelteComponent } from 'svelte';
import type { GENERATED_IMAGES } from './ImagesImportGenerator';
import type { PostMetadata } from './PostMetadata';

export type BlogPostImage = {[key in keyof typeof GENERATED_IMAGES]: string} & {alt: string}
export type ImportedPostFile = { images?: BlogPostImage, metadata: { [key: string]: string | undefined }, default: SvelteComponent };

/**
 * A Post is a post in the blog, materialised from a .svx file.
 *
 * @export
 * @class Post
 */
export class Post {
    private slug: string;
    private title: string;
    private date: Date;
    private image?: BlogPostImage;
    private summary?: string;
    private mastodon_post?: string;

    private plaintext: string;
    private body?: SvelteComponent;

    public static tagRegex = /(?<=\s)#([\w_]+)/g;

    constructor(
        slug: string, title: string, date: Date,
        image: BlogPostImage | undefined, summary: string | undefined,
        mastodon_post: string | undefined, plaintext: string, body?: SvelteComponent
    ) {
        this.slug = slug;
        this.title = title;
        this.date = date;
        this.image = image;
        this.summary = summary;
        this.mastodon_post = mastodon_post;

        this.plaintext = plaintext.slice(0, 500);
        this.body = body;
    }

    /**
     * fromModule takes an svx module with appropriate metadata in the frontmatter,
     * and materialises it into a Post object.
     *
     * @static
     * @param {string} slug the post slug desired
     * @param {ImportedPostFile} importedModule the imported module itself
     * @return {Post} the materialised post
     * @memberof Post
     */
    public static async fromModule(slug: string, importedModule: ImportedPostFile) {
        return new Post(
            slug, importedModule.metadata.title || 'No title',
            new Date(importedModule.metadata.date || ''),
            importedModule.images,
            importedModule.metadata.summary,
            importedModule.metadata.mastodon_post,
            importedModule.metadata.plaintext || 'No text',
            importedModule.default
        )
    }

    public static fromMetadata(metadata: PostMetadata) {
        return new Post(
            metadata.slug, metadata.title,
            new Date(metadata.date), metadata.image,
            metadata.summary, metadata.mastodon_post,
            metadata.plaintext
        );
    }

    /**
     * getSortOrder gets a representation of the post's relative sort.
     *
     * @return {Number} the sort order of the post
     * @memberof Post
     */
    public getSortOrder() {
        return this.date.valueOf();
    }

    /**
     * getPath gets the path that contains a Post.
     *
     * @return {string} the path containing the post
     * @memberof Post
     */
    public getPath() {
        return this.slug.split('/').slice(0, -1).join('/');
    }

    /**
     * getSummary gets a summary of the post, either from the summary
     * frontmatter metadata field, or by automatically summarising the
     * start of the post.
     *
     * @param {number} [charCount] the number of characters to include in the summary. If
     *                             this is not specified, it will default to returning the
     *                             entire contents of the summary metadata if specified, or
     *                             40 characters if not. Max 500 characters.
     * @return {string} the summary
     * @memberof Post
     */
    public getSummary(charCount?: number): string {
        let words = [];

        if (this.summary) {
            if (charCount) {
                words = this.summary.split(' ');
            } else {
                return this.summary;
            }
        } else {
            words = this.plaintext.split(' ');
        }

        if (!charCount) charCount = 80;
        charCount = charCount - 3;
        let summary = "";
        for (let word of words) {
            if ((summary.length + word.length + (summary != "" ? 1 : 0)) > charCount) break;
            if (summary != "") summary += " ";
            summary += word;
        }
        return summary.endsWith('.') || summary == this.plaintext ? summary : summary += "...";
    }

    /**
     * hasSummary returns true if the blog post has a specified summary,
     * and false otherwise.
     *
     * @return {boolean} true if the post has a manually-written summary
     * @memberof Post
     */
    public hasSummary(): boolean {
        return !!this.summary;
    }

    public getImage(): BlogPostImage | null {
        if (!this.image) return null;

        return this.image;
    }
    
    /**
     * getMetadata returns an object of {@link PostMetadata}.
     *
     * @return {PostMetadata} this post's metadata only
     * @memberof Post
     */
    public getMetadata(): PostMetadata {
        return {
            slug: this.slug,
            title: this.title,
            date: this.date.valueOf(),
            image: this.image,
            summary: this.summary,
            plaintext: this.plaintext,
            mastodon_post: this.mastodon_post
        }
    }

    /**
     * getTags gets an array of string tags from the post
     * summary.
     *
     * @return {string[]} an array of tags on the post
     * @memberof Post
     */
    public getTags(): string[] {
        if (!this.summary) return [];

        const tags = [];

        for (const match of this.summary.matchAll(Post.tagRegex)) {
            tags.push(match[1]);
        }

        return tags;
    }

    public getSlug() { return this.slug; }
    public getTitle() { return this.title; }
    public getDate() { return this.date; }
    public getBody() { return this.body; }
    public getMastodonPost() { return this.mastodon_post; }
}