<script>
	import { urlFor } from '$lib/Helpers';
	// @ts-ignore
	import me_png from '../assets/img/me.webp?w=1200&format=png';
	import prac_badge from '../assets/img/prac-badge.svg';

	let json_ld = `<script type="application/ld+json">
        {
            "@context": "http://schema.org/",
            "@type": "Person",
            "name": "Curtis Parfitt-Ford",
            "image": "${urlFor(me_png)}",
            "url": "${urlFor()}",
			"email": "wm@cpf.sh",
            "sameAs": [
                "https://mashedkeyboard.me/",
                "https://twitter.com/mashedkeyboard",
                "https://github.com/mashedkeyboard",
                "https://social.mashed.cloud/@curtispf"
            ]
        }
    <\/script>`;
</script>

<svelte:head>
	{@html json_ld}
</svelte:head>

<section class="makestuff">
	<h2>I make stuff and ask questions</h2>
	<p>
		I wear many hats: software engineer, student paramedic, activist, tech policy wonk, and even a beanie in the winter. I work for <a href="https://poteris.co.uk/">Poteris</a>, a non-profit
		tech-for-good consultancy.
	</p>
	<p>
		I'm particularly interested in human-computer interaction and the policy surrounding it.
		Technology gives us a lot of power, but that poses huge dangers if it's not properly regulated.
	</p>
	<p>
		I run <a href="https://loudspeek.cc/">Loudspeek</a>, a digital lobbying system for UK political
		campaigns.
	</p>
	<p>
		I'm an Emergency Ambulance Crew with <a href="https://www.sja.org.uk/">St John Ambulance</a>, and am studying for a pre-registration MSc in
		Paramedic Science.
	</p>
	<p>
		This site is open source: <a
			href="https://github.com/mashedkeyboard/mashedkeyboard-site"
			rel="noreferrer"
			target="_blank">
			the code is on GitHub
		</a>.
	</p>
	<a href="https://practitioner.sh/" title="I am a Practitioner Technologist" class="prac-badge">
		<img
			alt="I am a Practitioner Technologist: learn more about my commitment"
			src={prac_badge} />
	</a>
</section>

<style lang="scss">
	.prac-badge {
		img {
			max-width: calc(100% - 2em);
			width: 350px;
		}

		@media screen and (min-width: vars.$desktop_break) {
			position: absolute;
			left: -84px;
			width: 84px;
			overflow: hidden;
			bottom: 1em;

			&:hover {
				width: 350px;
			}

			img {
				max-width: 350px;
				width: 350px;
			}
		}
	}
</style>