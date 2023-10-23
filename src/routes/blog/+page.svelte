<script lang="ts">
    import PostList from '../../lib/components/blog/PostList.svelte';

	import { page } from "$app/stores";
	import type { PostMetadata } from "$lib/blog/PostMetadata";
	import { urlFor } from '$lib/Helpers';

    let posts: PostMetadata[] = JSON.parse($page.data.posts);
</script>

<div class="h-feed" itemscope itemtype="https://schema.org/BlogPosting">
	<link class="u-url" href={urlFor('blog')} itemprop="url" />
    <h2 itemprop="name" class="p-name">Thoughts on tech and society</h2>
    <p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>
    
    <PostList postMeta={posts} />
</div>