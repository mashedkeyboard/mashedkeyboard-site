<script lang="ts">
    import PostList from '../../lib/components/blog/PostList.svelte';

	import { page } from "$app/stores";
	import type { PostMetadata } from "$lib/blog/PostMetadata";
	import { urlFor } from '$lib/Helpers';
	import { blogTitle } from '$lib/blog/Settings';
	import FaIcon from '$lib/components/FAIcon.svelte';
	import { faRss } from '@fortawesome/free-solid-svg-icons';

    let posts: PostMetadata[] = JSON.parse($page.data.posts);
</script>

<svelte:head>
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/blog/rss">
</svelte:head>

<section class="h-feed" itemscope itemtype="https://schema.org/BlogPosting">
	<link class="u-url" href={urlFor('blog')} itemprop="url" />
    <header>
        <h2 itemprop="name" class="p-name">{blogTitle}</h2>
        <a href="/blog/rss" class="rss"><FaIcon icon={faRss} /> RSS feed</a>
    </header>
    <p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>
    
    <PostList postMeta={posts} />
</section>

<style lang="scss">
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media screen and (max-width: calc($tablet-break - 1px)) {
            display: block;
        }

        a.rss {
            color: $light;
            font-size: 0.8em;

            @media screen and (min-width: calc($tablet-break)) {
                text-decoration: none;
                padding: 1em;
                background-color: $primary_dark;
                font-size: 1em;

                @include light-mode {
                    background-color: $light;
                    color: $primary_dark;
                    border: 1px solid $primary_dark;
                }
            }
        }
    }
</style>