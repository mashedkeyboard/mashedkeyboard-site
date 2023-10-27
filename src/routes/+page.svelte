<script>
	import { urlFor } from '$lib/Helpers';
  import me_png from '../assets/img/me.webp?width=1200&format=png';

  let json_ld = `<script type="application/ld+json">
        {
            "@context": "http://schema.org/",
            "@type": "Person",
            "name": "Curtis Parfitt-Ford",
            "image": "${urlFor(me_png)}",
            "url": "${urlFor()}",
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
    I'm a developer, tech policy wonk, communications nerd and activist, currently based in Southampton in the UK. I work for <a href="https://poteris.co.uk/">Poteris</a>, a non-profit tech-for-good consultancy.
  </p>
  <p>
    I'm particularly interested in human-computer interaction and the policy surrounding it. Technology gives us a lot of power, but that poses huge dangers if it's not properly regulated.
  </p>
  <p>
    I run <a href="https://loudspeek.cc/">Loudspeek</a>, a digital lobbying system for UK political campaigns.
  </p>
  <p>
    I'm also an Emergency Ambulance Crew with St John Ambulance.
  </p>
  <p>
    This site is open source: <a href="https://github.com/mashedkeyboard/mashedkeyboard-site" rel="noreferrer" target="_blank">the code is on GitHub</a>.
  </p>
</section>