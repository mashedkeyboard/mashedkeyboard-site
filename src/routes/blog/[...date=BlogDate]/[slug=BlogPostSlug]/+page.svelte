<script lang="ts">
	import { page } from "$app/stores";
	import type { Post } from "$lib/blog/Post";
	import PostImage from "$lib/components/blog/PostImage.svelte";
	import Mentions from "$lib/components/blog/Mentions.svelte";
	import { onMount } from "svelte";

    const post: Post = $page.data.post;

    let mentionsRequest: Promise<Response> = new Promise(() => {});

    let mentionsPath = `/blog/${post.getSlug()}/mentions`;

    onMount(() => {
        mentionsRequest = fetch(`${mentionsPath}.json`);
    });
</script>

<svelte:head>
    <link href="/blog/webmention" rel="webmention" />
    <link href="https://brid.gy/publish/mastodon" />
</svelte:head>

<article class="h-entry">
    <!-- svelte-ignore a11y-missing-content -->
    <a class="u-author" href="/" aria-hidden="true"></a>
    <header>
        <PostImage {post} headerBg={true} />
        <div>
            <span class="dt-published">{post.getDate().toLocaleDateString()}</span>
            <h1 class="p-name">{post.getTitle()}</h1>
        </div>
    </header>
    <div class="e-content">
        <svelte:component this={post.getBody()} />
    </div>

    {#await mentionsRequest}
    <a href={mentionsPath}>View mentions</a>
    {:then mentionsResponse}
    {#await mentionsResponse.json() then mentions}
    <aside>
        <h2>Mentions</h2>
        <Mentions {mentions} mastodonPostUrl={post.getMastodonPost()} />
    </aside>
    {:catch}
    <span>Failed to parse mentions data.</span>
    {/await}
    {:catch}
    <span>Failed to fetch mentions response.</span>
    {/await}
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

        @media screen and (max-width: calc($mobile-break - 1px)) {
            margin-top: -3em;
        }

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

            @media screen and (max-width: calc($mobile-break - 1px)) {
                padding-top: 3em;
                margin-top: -3em;
            }
        }
    }
</style>