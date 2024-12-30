<script lang="ts">
	import type { Webmention } from '$lib/blog/Webmention';
	import FaIcon from '../FAIcon.svelte';
	import { faComment } from '@fortawesome/free-solid-svg-icons';

	import WebmentionCard from './WebmentionCard.svelte';

	interface Props {
		mentions: Webmention[];
		mastodonPostUrl?: string | undefined;
		isInline?: boolean;
	}

	let { mentions, mastodonPostUrl = undefined, isInline = false }: Props = $props();
</script>

{#if mastodonPostUrl}
	<div class="wm-intro">
		<FaIcon icon={faComment} />
		<p>
			<a href={mastodonPostUrl}>You can reply to this post on Mastodon</a>, or by Webmention.
		</p>
	</div>
{/if}
{#if mentions.length}
	<ol>
		{#each mentions as mention}
			<WebmentionCard {mention} li {isInline} />
		{/each}
	</ol>
{:else}
	no mentions yet
{/if}

<style lang="scss">
	.wm-intro {
		border-left: 1em solid vars.$primary;
		padding: 0.1em 1em;

		p {
			display: inline-block;
			padding-left: 0.25em;
		}
	}
</style>
