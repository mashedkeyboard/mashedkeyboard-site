<script lang="ts">
	import type { Post } from '$lib/blog/Post';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
</script>

<time class="dt-published" itemprop="datePublished" datetime={post.getDate().toISOString()}>
	{post.getDate().toLocaleDateString()}
</time>
