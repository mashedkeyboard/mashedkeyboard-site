<script>
	import { urlFor } from '$lib/Helpers';
	// @ts-ignore
	import me_png from '../assets/img/me.png?w=1200&format=png';
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
                "https://social.mashed.cloud/@curtispf",
				"https://orcid.org/0009-0005-6695-2439"
            ]
        }
    <\/script>`;
</script>

<svelte:head>
	{@html json_ld}
	<link rel="alternate" type="application/rss+xml" title="Blog RSS" href="/blog/rss.xml" />
</svelte:head>

<section class="makestuff">
	<h2>About me</h2>
	<p>
		I wear many hats: software engineer, student paramedic, activist, tech policy wonk, and even a
		beanie in the winter. I work for
		<a href="https://poteris.co.uk/" target="_blank">Poteris</a>,
		a non-profit tech-for-good consultancy.
	</p>
	<p>
		I'm an Emergency Ambulance Crew with
		<a href="https://www.sja.org.uk/" target="_blank">St John Ambulance</a>,
		and am studying for a pre-registration MSc in Paramedic Science.
		(Sorry, I can't give you medical advice online!)
	</p>
	<p>
		I'm beginning to develop a portfolio of research: you can find some of my work on
		<a href="https://orcid.org/0009-0005-6695-2439" target="_blank">my ORCiD</a>.
		I'm particularly interested in research relating to health technology or out-of-hospital
		urgent and emergency care, with a focus on keeping patients in the community for longer.
	</p>
	<p>
		When you catch me thinking about computers, I'm probably thinking about ethics, policy, health
		tech, and human-computer interaction. With technology comes power, and power poses huge dangers
		when misused. To try to leverage that power for good instead, I run
		<a href="https://loudspeek.cc/" target="_blank">Loudspeek</a>, a digital lobbying system
		for progressive political campaigns in the UK.
	</p>
	<p>
		This site is open source: <a
			href="https://github.com/mashedkeyboard/mashedkeyboard-site"
			rel="noreferrer"
			target="_blank">
			the code is on GitHub
		</a>.
	</p>
	<a href="https://practitioner.sh/" target="_blank" title="I am a Practitioner Technologist" class="prac-badge">
		<img alt="I am a Practitioner Technologist: learn more about my commitment" src={prac_badge} />
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
