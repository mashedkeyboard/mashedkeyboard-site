<script lang="ts">
	// below lines are ts-ignored due to their using imagetools
	// @ts-ignore
	import meAvif from '../../assets/img/me.png?w=150;300;600;1200&format=avif&as=srcset';
	// @ts-ignore
	import meWebp from '../../assets/img/me.png?w=150;300;600;1200&format=webp&as=srcset';
	// @ts-ignore
	import mePng from '../../assets/img/me.png?w=400&format=png';

	import Nav from '$lib/components/Nav.svelte';

	import { onMount } from 'svelte';

	import FaIcon from './FAIcon.svelte';
	import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
	import { faMastodon } from '@fortawesome/free-brands-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Pronouns from './Pronouns.svelte';

	interface Props {
		/**
		 * The heading for the header.
		 */
		heading?: string | null;

		/**
		 * Whether the header should be a H1, or just a nicely-styled span.
		 */
		useH1: boolean;

		/**
		 * A callback to run on easter triggers.
		 */
		oneaster: () => void;
	}

	let { heading = null, useH1 = true, oneaster = () => {} }: Props = $props();

	/**
	 * tapCount contains the number of taps on the picture since the last count started.
	 */
	let tapCount = $state(0);

	/**
	 * isPrompting is true if the tapCount has exceeded the prompt threshold, and the
	 * user is now being prompted for the egg.
	 */
	let isPrompting = $state(false);

	onMount(async () => {
		// reset number of taps every 1.5 seconds if it's not in prompting mode yet
		window.setTimeout(() => {
			if (!isPrompting) tapCount = 0;
		}, 1500);
	});

	$effect(() => {
		if (tapCount > 5) {
			isPrompting = true;
			if (tapCount >= 15) {
				oneaster();
				isPrompting = false;
				tapCount = 0;
			}
		}
	});
</script>

<header class="h-card">
	<link class="u-url" href="/" itemprop="author" />
	<picture
		class="me"
		ontouchstart={(e) => {
			e.preventDefault();
			tapCount += 1;
		}}
		style:transform={`rotate(${isPrompting ? (tapCount - 5) * 2 + 'deg' : '0deg'})`}>
		<source type="image/avif" sizes="12.54em" srcset={meAvif} />
		<source type="image/webp" sizes="12.54em" srcset={meWebp} />
		<img src={mePng} class="p-name" width="400" height="418" alt="Curtis Parfitt-Ford" />
	</picture>
	<div class="header-text">
		<div class="title">
			<svelte:element
				this={useH1 ? 'h1' : 'div'}
				class="header-heading"
				class:main-title={heading === null}>
				<span class="allow-smaller">
					<strong>Hi!</strong>
					{#if heading === null}
						I'm{/if}
				</span>
				{#if heading === null}
					Curtis{:else}{heading}{/if}
			</svelte:element>
			<div class="pronouns">
				{#if heading === null}My pronouns are <Pronouns />{:else}Curtis Parfitt-Ford (<Pronouns />){/if}
				🏳️‍🌈
			</div>
		</div>
		<div class="contact-icons">
			<span class="contact-intro">find me on:</span>
			<a
				rel="me noreferrer"
				target="_blank"
				href="https://social.mashed.cloud/@curtispf"
				class="u-url"
				aria-label="Mastodon">
				<FaIcon icon={faMastodon} opts={{ title: 'Mastodon', classes: 'fa-2xl' }} />
			</a>
			<a
				rel="me noreferrer"
				target="_blank"
				href="https://github.com/mashedkeyboard"
				class="u-url"
				aria-label="GitHub">
				<FaIcon icon={faGithub} opts={{ title: 'GitHub', classes: 'fa-2xl' }} />
			</a>
			<a href="mailto:website@cpf.sh" class="u-email" aria-label="Email">
				<FaIcon icon={faEnvelopeOpenText} opts={{ title: 'Email', classes: 'fa-2xl' }} />
			</a>
		</div>
	</div>
</header>
<Nav />

<style lang="scss">
	@use "sass:color";

	header {
		display: flex;
		padding: 3em;
		overflow: hidden;

		background: vars.$primary;
		transition: background-color 0.1s ease-in-out;

		color: vars.$light;
		align-items: end;
		justify-content: space-between;

		will-change: filter;
		transition: filter 1s;

		@media screen and (min-width: vars.$tablet_break) {
			border-radius: 1em;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		.header-heading {
			font-size: 2rem;
			font-weight: 400;
			font-family: 'Signika NegativeVariable';

			margin: 0.67em 0;
			line-height: 1.1;

			@media screen and (min-width: vars.$tiny_break) {
				font-size: 3rem;
			}

			&.main-title {
				font-size: 15vw;

				@media screen and (min-width: vars.$mobile_break) {
					font-size: 4rem;
				}

				& + .pronouns {
					@media screen and (min-width: vars.$tablet_break) {
						margin-top: -3em;
					}
				}
			}
		}

		.pronouns {
			color: #171717;
			@media screen and (min-width: vars.$tablet_break) {
				margin-top: -2em;
				margin-bottom: 1em;
			}
			@media screen and (max-width: calc(vars.$mobile_break - 1px)) {
				font-size: 0.8em;
			}
		}

		@media screen and (max-width: calc(vars.$tablet_break - 1px)) {
			.header-text {
				display: flex;
				flex-direction: column-reverse;
				margin-bottom: -2em;
				.header-heading {
					margin-bottom: 0;
				}
			}
		}

		@media screen and (max-width: calc(vars.$mobile_break - 1px)) {
			.header-text .header-heading .allow-smaller {
				font-size: 1.5rem;
				display: block;
			}
		}

		.me,
		.me img {
			height: 55vw;
			flex: 1;
			padding: 1.5em;
			width: auto;
			z-index: 2;
			transform-origin: bottom left;

			margin-left: -3em;
			margin-bottom: -3em;

			@media screen and (min-width: vars.$mobile_break) {
				height: 40vw;
				padding-left: 1.5em;
			}

			@media screen and (min-width: vars.$tablet_break) {
				height: 18em;
				margin-top: -7em;
				margin-bottom: -10em;
			}
		}

		&:hover {
			filter: drop-shadow(0 0 1em rgba(vars.$primary, 0.8));
		}

		.contact-icons {
			padding: 1rem;
			margin: -1rem;
			margin-left: -0.5rem;
			background: color.adjust(vars.$primary, $lightness: -25%);
			border-radius: 1em;
			display: inline-block;
			line-height: 2.5em;
			
			& > * {
				&:not(:last-child) {
					margin-right: 1em;
				}
			}

			:global(svg) {
				color: vars.$light;
			}

			.contact-intro {
				@media screen and (max-width: calc(vars.$tablet_break - 1px)) {
					display: block;
					margin-bottom: 1em;
				}
			}

			span {
				line-height: 1em;
			}

			@media screen and (min-width: vars.$tablet_break) {
				margin-top: 0.1em;
			}
		}
	}
</style>
