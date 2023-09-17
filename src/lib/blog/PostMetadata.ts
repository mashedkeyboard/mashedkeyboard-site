import type { BlogPostImage } from "./Post";

/**
 * PostMetadata contains a minimal amount of content relating to an
 * {@link Post}.
 *
 * @export
 * @interface PostMetadata
 */
export interface PostMetadata {
    slug: string;

    title: string;

    /**
     * date is stored in metadata as a Unix timestamp.
     *
     * @type {number}
     * @memberof PostMetadata
     */
    date: number;

    image?: BlogPostImage;

    summary?: string;

    plaintext: string;
}