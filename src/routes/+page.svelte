<script>
  import me_png from '../assets/img/me.png';

  let json_ld = `<script type="application/ld+json">
        {
            "@context": "http://schema.org/",
            "@type": "Person",
            "name": "Curtis Parfitt-Ford",
            "image": "https://mashedkeyboard.me` + me_png + `",
            "url": "https://mashedkeyboard.me/",
            "sameAs": [
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
    I'm a developer, tech policy wonk, communications nerd and activist, currently based in Southampton in the UK.
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