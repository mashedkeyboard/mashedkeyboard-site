<script lang="ts">
	import type { Post } from '$lib/blog/Post';

	interface Props {
		post: Post;
		headerBg?: boolean;
	}

	let { post, headerBg = false }: Props = $props();
</script>

{#if post.getImage()}
	<picture class:headerBg>
		<!--
			We need a width to give here, but this component is used in different places.
			For now, we'll give the width of 80% of the browser viewport, as thanks to the
			container design, the image will never be more than that, and that will keep us
			loading something appropriately-sized.
		-->
		<source type="image/avif" sizes="75vw" srcset={post.getImage()?.avifSrcsetImage} />
		<source type="image/webp" sizes="75vw" srcset={post.getImage()?.webpSrcsetImage} />
		<img
			src={post.getImage()?.fallbackImage}
			alt={post.getImage()?.alt}
			itemprop="image"
			class="u-featured" />
	</picture>
{/if}

<style lang="scss">
	picture {
		&.headerBg {
			position: absolute;
			left: 0;
			top: 0;
			overflow: hidden;
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
		}

		img {
			object-fit: cover;
			width: 100%;
		}
	}
</style>
