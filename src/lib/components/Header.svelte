<script lang="ts">
	// below lines are ts-ignored due to their using imagetools
	// @ts-ignore
	import meAvif from '../../assets/img/me.webp?width=150;300;600;1200&format=avif&srcset';
	// @ts-ignore
	import meWebp from '../../assets/img/me.webp?width=150;300;600;1200&format=webp&srcset';
	// @ts-ignore
	import mePng from '../../assets/img/me.webp?width=400&format=png';
	
	import Nav from '$lib/components/Nav.svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	import FaIcon from './FAIcon.svelte';
	import {faEnvelopeOpenText} from '@fortawesome/free-solid-svg-icons';
	import {faMastodon} from '@fortawesome/free-brands-svg-icons';
	import {faGithub} from '@fortawesome/free-brands-svg-icons';
	import Pronouns from './Pronouns.svelte';

	/**
	 * The heading for the header.
	 * @type {String | null}
	 */
	export let heading: string | null = null;

	/**
	 * tapCount contains the number of taps on the picture since the last count started.
	 */
	let tapCount = 0;

	/**
	 * isPrompting is true if the tapCount has exceeded the prompt threshold, and the
	 * user is now being prompted for the egg.
	 */
	let isPrompting = false;

	onMount(async () => {
		// reset number of taps every 1.5 seconds if it's not in prompting mode yet
		window.setTimeout(() => {if (!isPrompting) tapCount = 0}, 1500);
	});

	const dispatch = createEventDispatcher();

	$: if (tapCount > 5) {
		isPrompting = true;
		if (tapCount >= 15) {
			dispatch('easter');
			isPrompting = false;
			tapCount = 0;
		}
	}
</script>

<header class="h-card">
	<link class="u-url" href="/" />
	<picture class="me" on:touchstart|preventDefault={(e) => tapCount += 1} style:rotate={isPrompting ? "-" + ((tapCount - 5) * 2) + "deg" : "0deg"}>
		<source type="image/avif" srcset={meAvif} />
		<source type="image/webp" srcset={meWebp} />
		<img src={mePng} class="p-name" width="400" height="418" alt="Curtis Parfitt-Ford" />
	</picture>
	<div class="header-text">
		<div class="title">
			<h1 class:main-title={heading === null}>
				<span class="allow-smaller"><strong>Hi!</strong> {#if heading === null} I'm{/if}</span> {#if heading === null} Curtis{:else}{heading}{/if}
			</h1>
			<div class="pronouns">{#if heading === null}My pronouns are <Pronouns />{:else}Curtis Parfitt-Ford (<Pronouns />){/if} 🏳️‍🌈</div>
		</div>
		<div class="contact-icons">
			<span class="contact-intro">find me on:</span>
			<a rel="me noreferrer" target="_blank" href="https://social.mashed.cloud/@curtispf" class="u-url" aria-label="Mastodon">
				<FaIcon icon={faMastodon} opts={{title: "Mastodon", classes: "fa-2xl"}} />
			</a>
			<a rel="me noreferrer" target="_blank" href="https://github.com/mashedkeyboard" class="u-url" aria-label="GitHub">
				<FaIcon icon={faGithub} opts={{title: "GitHub", classes: "fa-2xl"}} />
			</a>
			<a href="mailto:curtis@mashedkeyboard.me" class="u-email" aria-label="Email">
				<FaIcon icon={faEnvelopeOpenText} opts={{title: "Email", classes: "fa-2xl"}} />
			</a>
		</div>
	</div>
</header>
<Nav />

<style lang="scss">
	@import '../scss/_variables';

	header {
		display: flex;
		padding: 3em;

		background: $primary;
		transition: background-color 0.1s ease-in-out;

		color: $light;
		align-items: end;
		justify-content: space-between;

		will-change: filter;
		transition: filter 1s;

		@media screen and (min-width: $tablet_break) {
			border-radius: 1em;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
		}

		h1 {
			font-size: 2rem;
			
			@media screen and (min-width: $tiny_break) {
				font-size: 3rem;
			}

			&.main-title {
				font-size: 15vw;

				@media screen and (min-width: $mobile_break) {
					font-size: 4rem;
				}
				
				& + .pronouns {
					@media screen and (min-width: $tablet_break) {
						margin-top: -3em;
					}
				}
			}
			font-weight: 400;
			font-family: 'Signika NegativeVariable';
		}

		.pronouns {
			color: #171717;
			@media screen and (min-width: $tablet_break) {
				margin-top: -2em;
				margin-bottom: 1em;
			}
			@media screen and (max-width: calc($mobile_break - 1px)) {
				font-size: 0.8em;
			}
		}

		@media screen and (max-width: calc($tablet_break - 1px)) {
			.header-text {
				display: flex;
				flex-direction: column-reverse;
				margin-bottom: -2em;
				h1 {
					margin-bottom: 0;
				}
			}
		}

		@media screen and (max-width: calc($mobile_break - 1px)) {
			.header-text h1 .allow-smaller {
				font-size: 1.5rem;
				display: block;
			}
		}

		.me,
		.me img {
			height: 30vw;
			flex: 1;
			padding: 1.5em;
			width: auto;

			@media screen and (min-width: $mobile_break) {
				height: 40vw;
				padding-left: 2em;
			}

			@media screen and (min-width: $tablet_break) {
				height: 12em;
			}

			margin-left: -3em;
			margin-bottom: -3em;
		}

		&:hover {
			filter: drop-shadow(0 0 1em rgba($primary, 0.8));
		}

		.contact-icons {
			& > * {
				&:not(:last-child) {
					margin-right: 1em;
				}
			}

			:global(svg) {
				color: $light;
			}

			.contact-intro {
				@media screen and (max-width: calc($tablet_break - 1px)) {
					display: block;
					margin-bottom: 1em;
				}
			}

			padding: 1rem;
			margin: -1rem;
			margin-left: -0.5rem;
			background: darken($primary, 25%);
			border-radius: 1em;
			display: inline-block;
			line-height: 2.5em;

			span {
				line-height: 1em;
			}

			@media screen and (min-width: $tablet_break) {
				margin-top: 0.1em;
			}
		}
	}
</style>
