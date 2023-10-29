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
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/blog/rss.xml">
</svelte:head>

<section class="h-feed" itemscope itemtype="https://schema.org/BlogPosting">
	<link class="u-url" href={urlFor('blog')} itemprop="url" />
    <header>
        <h1 itemprop="name" class="p-name">{blogTitle}</h1>
        <a href="/blog/rss.xml" class="rss"><FaIcon icon={faRss} /><span>{' '}RSS feed</span></a>
    </header>
    <p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>
    
    <PostList postMeta={posts} />
</section>

<style lang="scss">
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media screen and (max-width: calc($mobile-break - 1px)) {
            display: block;
        }

        h1 {
            font-size: 2rem;
        }

        a.rss {
            color: $light;
            font-size: 0.8em;
            text-decoration: none;
            border-bottom: 1px solid $light;

            @include light-mode {
                color: $primary_dark;
                border-bottom: 1px solid $primary_dark;
            }

            @media screen and (min-width: calc($tablet-break)) {
                span {
                    display: none;
                }
                
                padding: 1em;
                border: 1px solid $light;
                font-size: 1em;

                @include light-mode {
                    background-color: $light;
                    border: 1px solid $primary_dark;
                }
            }
        }
    }
</style>