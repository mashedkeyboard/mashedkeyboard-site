<script lang="ts">
	import { page } from "$app/stores";
	import type { Post } from "$lib/Post";
	import PostImage from "$lib/components/blog/PostImage.svelte";

    const post: Post = $page.data.post;
</script>

<article>
    <header>
        <PostImage {post} headerBg={true} />
        <div>
            <span>{post.getDate().toLocaleDateString()}</span>
            <h1>{post.getTitle()}</h1>
        </div>
    </header>
    <svelte:component this={post.getBody()} />
</article>

<style lang="scss">
    header {
        @include light-mode {
            color: $primary_dark;
        }

        @include dark-mode {
            background-color: $primary_dark;
        }

        padding: 1em;
        padding-top: 5em;
        margin: 0 -3em;
        margin-top: -4.1em;
        text-align: right;

        position: relative;

        div {
            position: relative;
            z-index: 2;
            background-color: rgba(0,0,0,0.5);

            @include light-mode {
                background-color: rgba(255,255,255,0.7);
            }

            padding: 1em;
            padding-top: 5em;
            margin: -1em;
            margin-top: -5em;
        }
    }
</style>