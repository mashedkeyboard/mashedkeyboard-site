<script>
	import { page } from '$app/stores';

	/**
	 * The title of the link.
	 * @type {String}
	 */
	export let title;

	/**
	 * The href to link the link to.
	 * @type {String}
	 */
	export let href;
</script>

<a {href} class:active={href === $page.route.id}>{title}</a>

<style lang="scss">
	@import '../lib/scss/_variables';

	a {
		padding: 0.5em 1em;
		text-decoration: none;
		color: #f2f2f2;

		@include light-mode {
			color: #202020;
		}

		font-weight: 800;

		@media screen and (min-width: $mobile-break) {
			width: 100%;
		}

		text-align: center;

		transition: background-color 0.2s ease-in-out;
		transition: color 0.2s ease-in-out;

		@media screen and (min-width: $mobile-break) {
			border-radius: 0.5em;
		}

		&.active {
			background: darken($primary, 20%);
			color: #f2f2f2;
		}

		&:hover {
			background-color: rgba($primary, 0.7);

			@include light-mode {
				&.active {
					background-color: lighten($primary, 10%);
				}

				&:not(.active) {
					background-color: #f2f2f2;
					color: $primary;
				}
			}

			cursor: pointer;
		}

		&:not(:first-of-type) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:not(:last-of-type) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
</style>
