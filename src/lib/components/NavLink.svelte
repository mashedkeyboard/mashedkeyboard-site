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

	$: isActive = href == '/' ? $page.route.id == href : $page.route.id?.startsWith(href);
</script>

<a {href} class:active={isActive} class:subrouteActive={isActive && href != $page.route.id}>{title}</a>

<style lang="scss">
	@import '../scss/_variables';

	$nav_link_border: 1px solid $primary_dark;

	a {
		padding: 0.5em 1em;
		text-decoration: none;
		color: $light;
		border-top: $nav_link_border;
		border-bottom: $nav_link_border;
		background-color: $dark;

		@include light-mode {
			color: $dark;
			background-color: $light;
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
			color: $light;
		}

		&.subrouteActive {
			background: darken($primary, 30%);
		}

		&:hover {
			background-color: rgba($primary, 0.7);

			@include light-mode {
				&.active {
					background-color: lighten($primary, 10%);
				}

				&:not(.active) {
					background-color: darken($light, 5%);
					color: $primary;
				}
			}

			cursor: pointer;
		}

		&:not(:first-of-type) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:first-of-type {
			border-left: $nav_link_border;
		}

		&:not(:last-of-type) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:last-of-type {
			border-right: $nav_link_border;
		}
	}
</style>
