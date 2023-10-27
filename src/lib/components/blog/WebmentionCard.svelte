<script lang="ts">
	import { VALID_WEBMENTION_TARGET_TYPE, type Webmention } from '$lib/blog/Webmention';
	import { onMount } from 'svelte';

	export let mention: Webmention;
	export let li: boolean;
	export let reply: boolean = false;
	export let isInline = false;

	const mentionUrl = new URL(mention.url);

	const isMicroformatRoot = (item: any): item is Exclude<typeof mention.mfItem, undefined> => {
		let rootItem = item as typeof mention.mfItem;
		return !!(rootItem && (rootItem.properties !== undefined || rootItem.value !== undefined));
	};

	const getAuthorName = (
		author: Exclude<Webmention['mfItem'], undefined>['properties']['author'][number]
	) => {
		if (isMicroformatRoot(author)) {
			if (author.properties.name) return author.properties.name[0];
			if (author.value) return author.value;
		}
		return author;
	};

	const actionType = (type: Webmention['type'], to = true): string => {
		const toExt = to ? ' to' : '';
		switch (type.toString()) {
			case VALID_WEBMENTION_TARGET_TYPE.Repost:
				return 'reposted';
			case VALID_WEBMENTION_TARGET_TYPE.Reply:
				return `replied${toExt}`;
			case VALID_WEBMENTION_TARGET_TYPE.Like:
				return 'liked';
			case 'link':
				return `linked${toExt}`;
		}
		throw new Error(`Missing action type for '${type}'`);
	};

	const bestUrl = mention.mfItem?.properties?.url?.[0]?.toString() || mention.url;

	const mentionDate = new Date(mention.date);

	let url: string;

	onMount(() => (url = window.location.href));
</script>

<svelte:element this={li ? 'li' : 'div'}>
	<article itemprop={isInline ? 'comment' : null} itemscope itemtype="https://schema.org/Comment">
		{#if mention.mfItem}
			{@const authors = mention.mfItem.properties?.author}
			{#each authors as author, i}
				{@const authorName = getAuthorName(author)}
				<a
					itemprop="author"
					href={isMicroformatRoot(author) && author.properties.url
						? author.properties.url[0].toString()
						: mention.url}
					rel="nofollow">{authorName}</a>
				{#if i + 1 != authors.length}
					{' '}and
				{/if}
			{/each}
			{@const thisPostUrl = mention.mfItem.properties[mention.type][0].toString()}
			{@const showTo = !reply && url !== thisPostUrl}
			<a href={bestUrl} itemprop="url" rel="nofollow">{actionType(mention.type, showTo)}</a>
			{#if showTo}<a href={thisPostUrl} rel="nofollow">this post</a>{/if}
		{:else}
			<a href={url} rel="nofollow">linked to by {mentionUrl.hostname}</a>
		{/if}
		at
		<date itemprop="dateCreated" datetime={mentionDate.toISOString()}>
			{mentionDate.toLocaleString()}
		</date>
		{#if mention.mfItem && isMicroformatRoot(mention.mfItem.properties?.content[0])}:
			<p itemprop="text">{mention.mfItem.properties.content[0].value}</p>
		{/if}
		{#if mention.replies}
			{#each mention.replies as reply}
				<ol class="reply">
					<svelte:self mention={reply} li reply isInline />
				</ol>
			{/each}
		{/if}
	</article>
</svelte:element>

<style lang="scss">
	ol.reply {
		list-style-type: '\21B3';
	}
</style>
