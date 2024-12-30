<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		title: string;
		href: string;
	}

	let { title, href }: Props = $props();

	let isActive = $derived(href == '/' ? $page.route.id == href : $page.route.id?.startsWith(href));
</script>

<a {href} class:active={isActive} class:subrouteActive={isActive && href != $page.route.id}>
	{title}
</a>

<style lang="scss">
	@use "sass:color";

	$nav_link_border: 1px solid vars.$primary_dark;

	a {
		padding: 0.5em 1em;
		text-decoration: none;
		color: vars.$light;
		border-top: $nav_link_border;
		border-bottom: $nav_link_border;
		background-color: vars.$dark;

		transition: background-color 0.2s ease-in-out;
		transition: color 0.2s ease-in-out;

		font-weight: 800;
		text-align: center;

		@include vars.light-mode {
			color: vars.$dark;
			background-color: vars.$light;
		}

		@media screen and (min-width: vars.$mobile-break) {
			width: 100%;
		}		

		@media screen and (min-width: vars.$mobile-break) {
			border-radius: 0.5em;

			&:first-of-type {
				border-left: $nav_link_border;
			}

			&:last-of-type {
				border-right: $nav_link_border;
			}
		}

		&.active {
			background: color.adjust(vars.$primary, $lightness: -20%);
			color: vars.$light;
		}

		&.subrouteActive {
			background: color.adjust(vars.$primary, $lightness: -30%);
		}

		&:hover {
			background-color: rgba(vars.$primary, 0.7);
			cursor: pointer;

			@include vars.light-mode {
				&.active {
					background-color: color.adjust(vars.$primary, $lightness: 10%);
				}

				&:not(.active) {
					background-color: color.adjust(vars.$light, $lightness: -5%);
					color: vars.$primary;
				}
			}
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
