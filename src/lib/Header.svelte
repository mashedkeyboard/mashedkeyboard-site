<script>
	import me2x from '../assets/img/me@2x.webp';
	import me from '../assets/img/me.webp';
	import me_png from '../assets/img/me.png';
	
	import Nav from '$lib/Nav.svelte';

	import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
	import '@fortawesome/fontawesome-free/scss/brands.scss';
	import '@fortawesome/fontawesome-free/scss/solid.scss';

	/**
	 * @type {String | null}
	 */
	 export let heading = null;
</script>

<header>
	<picture class="me">
		<source media="(min-width:1024px)" type="image/webp" srcset={me2x} />
		<source type="image/webp" srcset={me} />
		<img src={me_png} alt="Curtis Parfitt-Ford" />
	</picture>
	<div class="header-text">
		<div class="title">
			<h1 class:main-title={heading === null}>
				<span class="allow-smaller"><strong>Hi!</strong> {#if heading === null} I'm{/if}</span> {#if heading === null} Curtis{:else}{heading}{/if}
			</h1>
			<div class="pronouns">{#if heading === null}My pronouns are <em>he/him</em>{:else}Curtis Parfitt-Ford (<em>he/him</em>){/if} 🏳️‍🌈</div>
		</div>
		<div class="contact-icons">
			<span class="contact-intro">find me on:</span>
			<a rel="me noreferrer" target="_blank" href="https://social.mashed.cloud/@curtispf">
				<i
					class="fa-brands fa-mastodon fa-2xl"
					aria-hidden="true"
					title="Mastodon (federated social media)"
				>
					<span class="fa-sr-only">Mastodon</span>
				</i>
			</a>
			<a rel="noreferrer" target="_blank" href="https://github.com/mashedkeyboard">
				<i class="fa-brands fa-github fa-2xl" aria-hidden="true" title="GitHub">
					<span class="fa-sr-only">GitHub</span>
				</i>
			</a>
			<a href="mailto:curtis@mashedkeyboard.me">
				<i class="fa-solid fa-envelope-open-text fa-2xl" aria-hidden="true" title="Email">
					<span class="fa-sr-only">Email</span>
				</i>
			</a>
		</div>
	</div>
</header>
<Nav />

<style lang="scss">
	@import '../lib/scss/_variables';

	header {
		display: flex;
		padding: 3em;

		background: $primary;
		color: #f2f2f2;
		align-items: end;

		will-change: filter;
		transition: filter 1s;

		@media screen and (min-width: $tablet_break) {
			border-radius: 1em;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
		}

		h1 {
			font-size: 3rem;
			&.main-title {
				font-size: 4rem;
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
			padding: 1.5em;
			padding-left: 1em;

			@media screen and (min-width: $mobile_break) {
				height: 40vw;
				padding-left: 1.5em;
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

				i {
					color: #f2f2f2;
				}
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
