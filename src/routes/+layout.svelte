<script lang="ts">
	import { page } from '$app/stores';
	import { urlFor } from '$lib/Helpers';

	import { PUBLIC_ENV } from '$env/static/public';
	import globalStyles from '$lib/scss/global.scss?inline';

	import signika from '@fontsource/signika-negative/files/signika-negative-latin-variable-wghtOnly-normal.woff2';
	import cabin from '@fontsource/cabin/files/cabin-latin-variable-wghtOnly-normal.woff2';
	import cabin_italic from '@fontsource/cabin/files/cabin-latin-variable-wghtOnly-italic.woff2';

	import Header from '$lib/components/Header.svelte';

	import Console from '$lib/components/Console.svelte';

	import socialimg from '../assets/img/social.jpg';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	/**
	 * Controls whether the console is visible or not.
	 * Originates from Console.svelte, bound in here.
	 */
	let showConsole: boolean = $state(false);

	/**
	 * Handles checking for console opening.
	 */
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === '`' && !showConsole) {
			e.preventDefault();
			showConsole = true;
		}
	}

	const canonicalPath = urlFor($page.url.pathname);

	const notProduction = PUBLIC_ENV && PUBLIC_ENV.toUpperCase() != 'PRODUCTION';
</script>

<svelte:head>
	<!-- Preload our fonts before the browser starts parsing CSS -->
	{#each [signika, cabin, cabin_italic] as font}
		<link rel="preload" as="font" href={font} type="font/woff2" />
	{/each}

	{#if $page.data.noindex || notProduction}
		<meta name="robots" content="noindex{notProduction ? ', nofollow' : ''}" />
	{/if}

	<title>{$page.data.meta_title}</title>

	<link rel="canonical" href={canonicalPath} />

	{@html '<styl' + `e> type="text/css">${globalStyles}</s` + 'tyle>'}

	<meta property="og:type" content={$page.data.open_graph_type || 'website'} />
	<meta property="og:url" content={canonicalPath} />
	<meta property="og:image" content={$page.data.social_image || socialimg} />
	<meta property="og:title" content={$page.data.social_title || $page.data.meta_title} />
	<meta property="og:description" content={$page.data.description} />
	{#if $page.data.open_graph}
		{#each Object.entries($page.data.open_graph) as ogData}
			<meta property="og:{ogData[0]}" content={typeof ogData[1] === 'string' ? ogData[1] : null} />
		{/each}
	{/if}

	<meta name="description" content={$page.data.description} />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<a href="#content" class="skip-link">Skip to main content</a>

<div class="container">
	<Header
		heading={$page.data.heading || null}
		useH1={$page.data.has_own_h1 ? !$page.data.has_own_h1 : true}
		oneaster={() => (showConsole = true)} />
	<main id="content">
		{@render children?.()}
	</main>
</div>

<Console bind:showConsole />

<style lang="scss">
	a.skip-link {
		position: absolute;
		top: -3em;

		background: vars.$dark;
		color: vars.$light;
		@include vars.light-mode {
			background-color: vars.$light;
			color: vars.$dark;
		}

		&:focus {
			top: 0;
		}
	}

	.container {
		max-width: vars.$tablet_break;
		width: 100vw;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		position: relative;

		// Dark background
		// Done in a pseudoelement so as to not interfere with the flag
		&:before {
			background: vars.$dark;
			content: "";
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;

			@media screen and (min-width: vars.$tablet_break) {
				border-radius: 1rem;
			}

			@include vars.light-mode {
				background-color: vars.$light;
				color: vars.$dark;
			}
		}

		// Flag
		@media screen and (min-width: vars.$tablet_break) {
			&:after {
				z-index: -1;
				height: 25em;
				width: 30em;
				position: absolute;
				content: "";
				left: -11em;
				top: 10em;
				margin: auto;
				transform: rotate(-45deg);
				border-top-left-radius: 1em !important;
				border-top-right-radius: 1em !important;
				background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), vars.$enby;
			}
		}

		@include vars.light-mode {
			color: vars.$dark;
		}

		@media screen and (min-width: vars.$tablet_break) {
			min-height: 0;
		}

		@media screen and (min-width: vars.$tablet_break) {
			margin: 2em 0;
			filter: drop-shadow(0 0 2rem rgba(vars.$primary_dark, 0.8));
		}

		main {
			position: relative;
		}

		:global {
			& > * {
				&:not(header, nav) {
					padding: 0.5rem 3rem 0.5rem 3rem;
					margin: 0;
				}

				z-index: 1;

				&:not(:first-child) {
					border-top-left-radius: 0;
					border-top-right-radius: 0;
					z-index: 10;
				}

				&:nth-child(2) {
					padding-top: 1rem;
				}

				&:not(:last-child) {
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
				}

				&:last-child {
					padding-bottom: 1.5em;
					flex-grow: 1;
				}

				h1 {
					font-size: 3.2rem;
					line-height: 1.1;
				}

				.flex-30 {
					flex: 30%;
				}

				.flex-50 {
					flex: 50%;
				}
			}
		}
	}
</style>
