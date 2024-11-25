<script lang="ts">
	import PostList from '../../../../lib/components/blog/PostList.svelte';

	import { page } from '$app/stores';
	import type { PostMetadata } from '$lib/blog/PostMetadata';

	let posts: PostMetadata[] = JSON.parse($page.data.posts);
</script>

<div class="h-feed">
	<h1 class="p-name">Posts tagged "#{$page.data.tag}"</h1>

	{#if posts.length}
		<PostList postMeta={posts} />
	{:else}
		<p>No posts found!</p>
	{/if}
</div>
