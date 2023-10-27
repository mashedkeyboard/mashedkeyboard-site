<script lang="ts">
	import type { Post } from "$lib/blog/Post";

	export let post: Post;
</script>

<time class="dt-published" itemprop="datePublished" datetime={post.getDate().toISOString()}>
	{post.getDate().toLocaleDateString()}
</time>
