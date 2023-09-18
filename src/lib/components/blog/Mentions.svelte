<script lang="ts">
	import type { Webmention } from "$lib/blog/Webmention";
	import WebmentionCard from "./WebmentionCard.svelte";

    export let mentions: Webmention[];
</script>
{#if mentions.length}
<ol>
    {#each mentions as mention}
    <WebmentionCard {mention} li />
    {/each}
</ol>
{:else}
no mentions yet
{/if}