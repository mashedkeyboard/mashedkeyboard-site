<script lang="ts">
	import PostDate from '$lib/components/blog/PostDate.svelte';

	import { page } from '$app/stores';
	import { Post } from '$lib/blog/Post';
	import PostImage from '$lib/components/blog/PostImage.svelte';
	import Mentions from '$lib/components/blog/Mentions.svelte';
	import { onMount } from 'svelte';
	import { urlForPost } from '$lib/Helpers';
	import type Status from 'tsl-mastodon-api/lib/JSON/Status';

	const post: Post = $page.data.post;
	const toots: Map<string, Status> = $page.data.toots;

	let mentionsRequest: Promise<Response> = $state(new Promise(() => {}));

	let mentionsPath = `/blog/${post.getSlug()}/mentions`;

	onMount(() => {
		mentionsRequest = fetch(`${mentionsPath}.json`);
	});

	const SvelteComponent = post.getBody();
</script>

<svelte:head>
	<link href="/blog/webmention" rel="webmention" />
	<link href="/" rel="author" />
	<link href="https://brid.gy/publish/mastodon" />
</svelte:head>

<article
	itemscope
	itemtype="https://schema.org/BlogPosting"
	itemid={urlForPost(post)}
	class="h-entry">
	<link class="u-author" href="/" itemprop="author" />
	<header>
		<PostImage {post} headerBg={true} />
		<div>
			<PostDate {post} />
			<h1 class="p-name" itemprop="headline name">{post.getTitle()}</h1>
		</div>
	</header>
	{#if post.hasSummary()}
		<div class="p-summary e-bridgy-mastodon-content" itemprop="abstract">
			{@html post
				.getSummary()
				.replaceAll(
					Post.tagRegex,
					`<a class="p-category" itemprop="keywords" href="/blog/tag/$1">#$1</a>`
				)}
		</div>
	{/if}
	<div class="e-content" itemprop="articleBody">
		<SvelteComponent {toots} />
	</div>

	{#await mentionsRequest}
		<a href={mentionsPath}>View mentions</a>
	{:then mentionsResponse}
		{#await mentionsResponse.json() then mentions}
			<aside>
				<h2>Mentions</h2>
				<Mentions {mentions} mastodonPostUrl={post.getMastodonPost()} isInline />
			</aside>
		{:catch}
			<span>Failed to parse mentions data.</span>
		{/await}
	{:catch}
		<span>Failed to fetch mentions response.</span>
	{/await}
</article>

<style lang="scss">
	@use "sass:color";

	article {
		padding-bottom: 1em;
	}

	header {
		padding: 1em;
		padding-top: 5em;
		margin: 0 -3em;
		margin-top: -4.1em;
		text-align: right;
		position: relative;

		@include vars.light-mode {
			color: vars.$primary_dark;
		}

		@include vars.dark-mode {
			background-color: vars.$primary_dark;
		}

		@media screen and (max-width: calc(vars.$mobile-break - 1px)) {
			margin-top: -3em;
		}

		div {
			position: relative;
			z-index: 2;
			background-color: rgba(0, 0, 0, 0.5);

			padding: 1em;
			padding-top: 5em;
			margin: -1em;
			margin-top: -5em;

			@include vars.light-mode {
				background-color: rgba(255, 255, 255, 0.7);
			}

			@media screen and (max-width: calc(vars.$mobile-break - 1px)) {
				padding-top: 3em;
				margin-top: -3em;
			}
		}
	}

	.p-summary {
		padding: 1em;
		margin-left: -3em;
		margin-right: -3em;
		padding-left: 3em;
		padding-right: 3em;
		font-style: italic;

		@include vars.light-mode {
			color: vars.$primary_dark;
			border-bottom: 0.2em dashed vars.$primary;
		}

		@include vars.dark-mode {
			background-color: color.adjust(vars.$primary, $lightness: -30%);
			color: vars.$light;

			:global(a) {
				color: #fff;
			}
		}
	}

	.e-content {
		:global(aside),
		:global(figure) {
			margin: 0;
			margin-bottom: 1em;
			padding: 1em;
			
			@media screen and (min-width: vars.$mobile-break) {
				float: right;
				text-align: right;
				max-width: 50%;
				margin-left: 1.5em;
			}

			:global(img) {
				max-width: 100%;
			}

			:global(figcaption) {
				text-align: center;
			}
		}
		
		// has to be separate for now - see https://github.com/sveltejs/vite-plugin-svelte/issues/1161
		:global(figure:has(figcaption)) {
			border: 1px solid vars.$light;

			@include vars.light-mode {
				border: 1px solid vars.$primary_dark;
			}
		}
	}
</style>
