<script lang="ts">
	import type Status from 'tsl-mastodon-api/lib/JSON/Status';
	import sanitizeHtml from 'sanitize-html';
	import FaIcon from './FAIcon.svelte';
	import { faMastodon } from '@fortawesome/free-brands-svg-icons';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	let tootWithEmojis: string | undefined = $state();

	const toot = JSON.parse(status) as Status;

	if (toot) {
		tootWithEmojis = toot.emojis.reduce((tootContent, newEmoji) => {
			return tootContent.replaceAll(
				`:${newEmoji.shortcode}:`,
				`<img src="${newEmoji.static_url}" alt="${newEmoji.shortcode} emoji"
                      referrerpolicy="no-referrer" loading="lazy"
                      fetchpriority="low" />`
			);
		}, toot.content);
	}
</script>

{#if toot}
	<article>
		<a href={toot.url} class="masto-icon">
			<FaIcon opts={{ title: 'Toot from Mastodon', classes: 'fa-2xl' }} icon={faMastodon} />
		</a>

		<section class="author">
			<a href={toot.account.url}>{toot.account.display_name}</a>
			<a href={toot.url}>tooted</a>:
		</section>
		<section class="content">
			<p>
				{@html sanitizeHtml(tootWithEmojis ?? '', {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
				})}
			</p>
			<p class="date"><date datetime={toot.created_at}>{new Date(toot.created_at).toLocaleString()}</date></p>
		</section>
		{#if toot.poll}
			<section>
				<h4>Poll responses</h4>
				<ol>
					{#each toot.poll.options as option}
						<li>{option.title}: {option.votes_count || 0 / toot.poll.votes_count}%</li>
					{/each}
				</ol>
			</section>
		{/if}
	</article>
{/if}

<style lang="scss">
	article {
		border: 1px solid vars.$light;
		padding: 1em;

		@include vars.light-mode {
			border: 1px solid vars.$primary_dark;
		}

		ol {
			list-style: none;
		}

		:global(.content p img) {
			width: 1em;
		}

		a.masto-icon {
			float: left;
			color: vars.$light;
			margin-right: 1em;

			@include vars.light-mode {
				color: vars.$primary_dark;
			}
		}
	}

	.date {
		font-style: italic;
		font-size: 0.8em;
	}
</style>
