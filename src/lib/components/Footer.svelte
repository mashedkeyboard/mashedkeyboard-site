<script lang="ts">
	import { faBan, faCubes, faEgg, faLock, faRobot } from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "./FAIcon.svelte";
	import { faOrcid } from "@fortawesome/free-brands-svg-icons";

	const easterEggTitle = "there's an easter egg on this site: try to find it";
</script>

<footer>
	<ul>
		<li><a href="https://orcid.org/0009-0005-6695-2439" title="Open Researcher and Contributor ID" target="_blank"><FaIcon icon={faOrcid} /> ORCID</a></li>
		<li><a href="/cpf.asc" target="_blank"><FaIcon icon={faLock} /> PGP key</a></li>
		<li><a href="https://scrimblo.foundation/" target="_blank"><FaIcon icon={faCubes} /> Scrimblo Foundation</a></li>
		<li>
			<span class="fa-layers fa-fw" title="no genAI used">
				<FaIcon icon={faRobot} opts={{classes: 'fa-2xs'}} />
				<FaIcon icon={faBan} opts={{classes: 'fa-lg primary_dark'}} />
			</span>
			handcrafted artisanal webpage
		</li>
		<li ontouchstart={() => window.alert(easterEggTitle)}><FaIcon icon={faEgg} opts={{ title: easterEggTitle }} /><noscript>&nbsp;<small>(the easter egg requires javascript)</small></noscript></li>
	</ul>
</footer>

<style lang="scss">
	@use 'sass:color';

	footer {
		padding: .3em 3em;
		border-top: .1em dashed vars.$light;
		margin-top: 1em;

		@media screen and (min-width: vars.$tablet_break) {
			border-top: .2em groove vars.$primary;
			margin-top: 0;
		}

		ul {
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			gap: 1em;
			padding: 0;
			list-style: none;
			text-align: center;
			text-transform: lowercase;

			li {
				border-bottom: 0.5em solid vars.$dark;
				border-image: linear-gradient(to right, vars.$dark 0%, color.adjust(vars.$dark, $lightness: -5%) 100%) 1 100%;
				padding: 0.25em;

				a {
					text-decoration: none;
					padding-bottom: .5em;
					border-bottom: .1em solid vars.$primary;
				}

				&::after {
					content: ' ';
					letter-spacing: 1em;
					background: linear-gradient(to right, transparent 0%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%);
				}
			}
		}
	}

	:global(.heart-yes) {
		color: darkgreen;
	}
</style>