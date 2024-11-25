<script lang="ts">
	import { Post } from '$lib/blog/Post';
	import type { PostMetadata } from '$lib/blog/PostMetadata';
	import PostImage from '$lib/components/blog/PostImage.svelte';
	import PostDate from './PostDate.svelte';

	let { postMeta } = $props();
	let posts: Post[] = postMeta.map((thisPost: PostMetadata) => Post.fromMetadata(thisPost));
</script>

<ol>
	{#each posts as post}
		<li>
			<article
				itemprop="blogPost"
				itemscope
				itemtype="https://schema.org/BlogPosting"
				class="h-entry">
				<a itemprop="url" class="u-url" href="/blog/{post.getSlug()}">
					<div>
						<PostImage {post} />
					</div>
					<h3 class="p-name" itemprop="headline name">{post.getTitle()}</h3>
					<PostDate {post} />
					<p class="p-summary" itemprop="abstract">{post.getSummary()}</p>
				</a>
			</article>
		</li>
	{/each}
</ol>

<style lang="scss">
	ol {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;

		li {
			flex: 1 250px;
		}
	}

	article {
		background-color: $primary_dark;
		padding: 1em;
		margin-left: -1em;
		margin-right: -1em;
		margin-bottom: 1em;

		@media screen and (min-width: $mobile_break) {
			margin: 1em;
		}

		a {
			color: $light;
			text-decoration: none;
			display: block;
			margin: -1em;
			padding: 1em;

			h3 {
				font-weight: bold;
				font-size: 1.5em;
			}

			div {
				margin: -1em;
				padding-bottom: 1em;
			}
		}

		@include light-mode {
			background: none;
			border: 1px solid $primary_dark;

			a {
				color: $dark;

				h3 {
					color: $primary_dark;
				}
			}
		}
	}
</style>
