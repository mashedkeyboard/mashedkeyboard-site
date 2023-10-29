<script lang="ts">
	import { page } from "$app/stores";
	import type { Webmention } from "$lib/blog/Webmention";
	import Mentions from "$lib/components/blog/Mentions.svelte";

    let mentions: Webmention[] = $page.data.mentions;
</script>
<h1>Mentions for <a href="./">{$page.data.postName}</a></h1>
<Mentions {mentions} mastodonPostUrl={$page.data.postMastoUrl} />

<style lang="scss">
	h1 {
		font-size: 2rem !important;
	}
</style>