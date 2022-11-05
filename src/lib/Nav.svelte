<script>
	import NavLink from '$lib/NavLink.svelte';
	import {beforeNavigate, afterNavigate} from '$app/navigation';

	let showNav = false;

	afterNavigate(() => {
		showNav = false;
	});
</script>

<button class="openMenu" on:click={() => (showNav = true)}>
    <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true" /> Menu
</button>

<nav class={showNav ? 'mobile-open' : ''}>
	<div class="menu-title">
		<h2>Curtis Parfitt-Ford</h2>
		<button on:click={() => (showNav = false)}>
			<i class="fa-solid fa-square-xmark" title="Close menu" aria-hidden="true" />
			<span class="sr-only">Close menu</span>
		</button>
	</div>
	<NavLink title="Home" href="/" />
	<NavLink title="CV" href="/cv" />
</nav>

<style lang="scss">
	@import '../lib/scss/_variables';

	nav {
		justify-content: space-around;
		padding: 0.5em;
		display: none;

		.menu-title {
			display: none;
		}

		@media screen and (max-width: calc($mobile-break - 1px)) {
			&.mobile-open {
				position: fixed;
				background: #202020;
				width: 100%;
				height: 100vh;
                overflow: hidden;
				top: 0;
				padding: 0;
				flex-direction: column;
				display: flex;
				justify-content: start;

				.menu-title {
					display: flex;
					justify-content: space-between;
					padding: 1em;
					background-color: $primary;
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

		@media screen and (min-width: $mobile-break) {
			display: flex;
		}

        @media not screen {
            display: none;
        }
	}

	button.openMenu {
		width: 100%;
		border: none;
		font-size: 1em;
		background-color: rgba($primary, 0.2);
		text-transform: lowercase;
		@media screen and (min-width: $mobile-break), not screen {
			display: none;
		}
	}
</style>
