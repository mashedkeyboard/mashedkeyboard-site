<script lang="ts">
    import PostList from '../../lib/components/blog/PostList.svelte';

	import { page } from "$app/stores";
	import type { PostMetadata } from "$lib/blog/PostMetadata";

    let posts: PostMetadata[] = JSON.parse($page.data.posts);
</script>

<div class="h-feed">
    <!-- svelte-ignore a11y-missing-content -->
	<a class="u-url" href="/" aria-hidden="true"></a>
    <h2 class="p-name">Thoughts on tech and society</h2>
    <p><small>No promises as to how often this gets updated, but sometimes there's things longer than a Toot that I want to share.</small></p>
    
    <PostList postMeta={posts} />
</div>