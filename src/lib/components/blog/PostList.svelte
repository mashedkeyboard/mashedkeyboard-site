<script lang="ts">
	import { Post } from "$lib/blog/Post";
	import type { PostMetadata } from "$lib/blog/PostMetadata";
	import PostImage from "$lib/components/blog/PostImage.svelte";

    export let postMeta;
    let posts: Post[] = postMeta.map((thisPost: PostMetadata) => Post.fromMetadata(thisPost));
</script>

<ol>
        {#each posts as post}
            <li>
                <article class="h-entry">
                    <a class="u-url" href="/blog/{post.getSlug()}">
                        <div>
                            <PostImage {post} />
                        </div>
                        <h3 class="p-name">{post.getTitle()}</h3>
                        <p class="dt-published">{post.getDate().toLocaleDateString()}</p>
                        <p class="p-summary">{post.getSummary()}</p>
                    </a>
                </article>
            </li>
        {/each}
    </ol>

<style lang="scss">
    ol {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;

        li {
            flex: 1 250px;
        }
    }

    article {
        background-color: $primary;
        padding: 1em;
        margin: 1em;

        a {
            color: $light;
            text-decoration: none;
            display: block;
            margin: -1em;
            padding: 1em;

            div {
                margin: -1em;
                padding-bottom: 1em;
            }
        }
    }
</style>

