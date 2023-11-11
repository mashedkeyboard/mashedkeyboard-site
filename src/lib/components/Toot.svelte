<script lang="ts">
	import type Status from "tsl-mastodon-api/lib/JSON/Status";
    import sanitizeHtml from 'sanitize-html';
	import FaIcon from "./FAIcon.svelte";
	import { faMastodon } from "@fortawesome/free-brands-svg-icons";

	export let url: string;
    export let toots: Map<string, Status>;

    let tootWithEmojis: string;

    const toot = toots.get(url);

    if (toot) {
        tootWithEmojis = toot.emojis.reduce((tootContent, newEmoji) => {
            return tootContent.replaceAll(
                `:${newEmoji.shortcode}:`,
                `<img src="${newEmoji.static_url}" alt="${newEmoji.shortcode} emoji"
                      referrerpolicy="no-referrer" loading="lazy"
                      fetchpriority="low" />`
            );
        }, toot.content)
    }
</script>

{#if toot}
    <article>
        <a href={toot.url} class="masto-icon">
            <FaIcon opts={{title: "Toot from Mastodon", classes: "fa-2xl"}} icon={faMastodon} />
        </a>

        <section class="author">
            <a href={toot.account.url}>{toot.account.display_name}</a> <a href={toot.url}>tooted</a>:
        </section>
        <section class="content">
            <p>
                {@html sanitizeHtml(tootWithEmojis, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
                  })}
            </p>
        </section>
        {#if toot.poll}
            <section>
                <h4>Poll responses</h4>
                <ol>
                {#each toot.poll.options as option}
                <li>{option.title}: {option.votes_count || 0 / toot.poll.votes_count}%</li>
                {/each}
                </ol>
            </section>
        {/if}
    </article>
{/if}

<style lang="scss">
    article {
        border: 1px solid $light;
        @include light-mode {
            border: 1px solid $primary_dark;
        }

        padding: 1em;

        ol {
            list-style: none;
        }

        .content p :global(img) {
            width: 1em;
        }

        a.masto-icon {
            float: left;
            color: $light;
            @include light-mode {
                color: $primary_dark;
            }
        }
    }
</style>