<script lang="ts">
	import type { Webmention } from "$lib/blog/Webmention";
	import WebmentionCard from "./WebmentionCard.svelte";

    export let mentions: Webmention[];

    let mastodonPostUrl: string | undefined;
    
    mentions.filter((m) => !!m.mfItem).find((item) => {
        for (let urlType of (item.mfItem?.properties?.url || []).concat(item.mfItem?.properties?.["in-reply-to"]?.reverse() || [])) {
            if (urlType) {
                const url = new URL(urlType.toString());
                if (url.hostname == "social.mashed.cloud" && url.pathname.startsWith("/@curtispf")) {
                    mastodonPostUrl = url.toString();
                    return true;
                }
            }
        }
        return false;
    });
</script>
{#if mastodonPostUrl}
<div class="wm-intro">
    <p>
        <a href={mastodonPostUrl}>You can reply to this post on Mastodon</a>, or by Webmention.
    </p>
</div>
{/if}
{#if mentions.length}
<ol>
    {#each mentions as mention}
    <WebmentionCard {mention} li />
    {/each}
</ol>
{:else}
no mentions yet
{/if}