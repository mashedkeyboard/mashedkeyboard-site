<script lang="ts">
	import { page } from "$app/stores";
	import type { Webmention } from "$lib/blog/Webmention";
	import Mentions from "$lib/components/blog/Mentions.svelte";

    let mentions: Webmention[] = $page.data.mentions;
</script>
<h2>Mentions for <a href="./">{$page.data.postName}</a></h2>
<Mentions {mentions} />