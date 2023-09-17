<script lang="ts">
	import { page } from "$app/stores";
	import { Post } from "$lib/blog/Post";
	import type { PostMetadata } from "$lib/blog/PostMetadata";
	import PostImage from "$lib/components/blog/PostImage.svelte";

    let posts: Post[] = JSON.parse($page.data.posts).map((postMeta: PostMetadata) => Post.fromMetadata(postMeta));
</script>

<h2>Thoughts on tech and society</h2>
<p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>

<ol>
    {#each posts as post}
        <li>
            <article>
                <a href="/blog/{post.getSlug()}">
                    <div>
                        <PostImage {post} />
                    </div>
                    <h3>{post.getTitle()}</h3>
                    <p>{post.getDate().toLocaleDateString()}</p>
                    <p>{post.getSummary()}</p>
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