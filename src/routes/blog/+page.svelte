<script lang="ts">
	import { page } from "$app/stores";
	import { Post } from "$lib/blog/Post";
	import type { PostMetadata } from "$lib/blog/PostMetadata";
	import PostImage from "$lib/components/blog/PostImage.svelte";

    let posts: Post[] = JSON.parse($page.data.posts).map((postMeta: PostMetadata) => Post.fromMetadata(postMeta));
</script>

<div class="h-feed">
    <!-- svelte-ignore a11y-missing-content -->
	<a class="u-url" href="/" aria-hidden="true"></a>
    <h2 class="p-name">Thoughts on tech and society</h2>
    <p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>
    
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
</div>

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