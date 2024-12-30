<script>
	import NavLink from '$lib/components/NavLink.svelte';
	import { afterNavigate } from '$app/navigation';
	import { faEllipsisVertical, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
	import FaIcon from '$lib/components/FAIcon.svelte';

	let showNav = $state(false);

	afterNavigate(() => {
		showNav = false;
	});
</script>

<button class="openMenu" onclick={() => (showNav = true)}>
	<FaIcon icon={faEllipsisVertical} /> Menu
</button>

<nav class={showNav ? 'mobile-open' : ''}>
	<div class="menu-title">
		<h2>Curtis Parfitt-Ford</h2>
		<button onclick={() => (showNav = false)}>
			<FaIcon icon={faSquareXmark} opts={{ title: 'Close menu' }} />
		</button>
	</div>
	<NavLink title="Home" href="/" />
	<NavLink title="CV" href="/cv" />
	<NavLink title="Blog" href="/blog" />
</nav>

<noscript>
	<!-- Don't allow the mobile menu to show if there's no JS -->
	<style>
		nav {
			display: flex !important;
		}
		button.openMenu {
			display: none;
		}
	</style>
</noscript>

<style lang="scss">
	nav {
		z-index: 999 !important;

		justify-content: space-around;
		padding: 0.5em;
		display: none;

		.menu-title {
			display: none;
		}

		@media screen and (max-width: calc(vars.$mobile-break - 1px)) {
			&.mobile-open {
				position: fixed;
				background: vars.$dark;

				@include vars.light-mode {
					background: vars.$light;
				}

				width: 100%;
				height: 100vh;
				z-index: 10000;
				overflow: hidden;
				top: 0;
				padding: 0;
				flex-direction: column;
				display: flex;
				justify-content: start;

				.menu-title {
					display: flex;
					color: vars.$light;
					justify-content: space-between;
					padding: 1em;
					background-color: vars.$primary;
					margin-top: 0;

					h2 {
						display: inline;
					}

					button {
						background: none;
						border: 0;
						padding: 0 0.5em;
						font-size: 2em;
						border-radius: 0.5em;
					}
				}
			}
		}

		@media screen and (min-width: vars.$mobile-break) {
			display: flex;
		}

		@media not screen {
			display: none;
		}
	}

	button.openMenu {
		z-index: 999 !important;

		width: 100%;
		border: none;
		font-size: 1em;
		background-color: vars.$primary_dark;
		color: vars.$light;
		text-transform: lowercase;
		@media screen and (min-width: vars.$mobile-break), not screen {
			display: none;
		}
	}
</style>
