<script lang="ts">
	import { VALID_WEBMENTION_TARGET_TYPE, type Webmention } from "$lib/blog/Webmention";

    export let mention: Webmention;
    export let li: boolean;

    const mentionUrl = new URL(mention.url);

    const isMicroformatRoot = (item: any): item is typeof mention.mfItem => {
        let rootItem = (item as typeof mention.mfItem);
        return (rootItem && (rootItem.properties !== undefined || rootItem.value !== undefined))
    }

    const getAuthorName = (author: typeof mention.mfItem.properties.author[number]) => {
        if (isMicroformatRoot(author)) {
            if (author.properties.name) return author.properties.name[0];
            if (author.value) return author.value;
        }
        return author;
    };

    const actionType = (type: Webmention['type']): string => {
        switch (type.toString()) {
            case VALID_WEBMENTION_TARGET_TYPE.Repost:
                return "reposted";
            case VALID_WEBMENTION_TARGET_TYPE.Reply:
                return "replied to";
            case VALID_WEBMENTION_TARGET_TYPE.Like:
                return "liked";
            case 'link':
                return "linked to";
        }
        throw new Error(`Missing action type for '${type}'`);
    };
</script>

<svelte:element this={li ? 'li' : 'div'}>
    <article>
        {#if mention.type == 'link'}
        <a href={mention.url} rel="nofollow">linked to by {mentionUrl.hostname}</a>
        {:else if mention.mfItem}
        {#each mention.mfItem.properties.author as author}
            {@const authorName = getAuthorName(author)}
            <a href={isMicroformatRoot(author) && author.properties.url ? author.properties.url.toString() : mention.url} rel="nofollow">{authorName}</a>
        {/each}
            <a href={mention.mfItem.properties.url?.[0].toString()} rel="nofollow">{actionType(mention.type)}</a>
            <a href={mention.mfItem.properties[mention.type][0].toString()} rel="nofollow">this post</a>
        {:else}
            <span class="error">A comment was registered, but I can't display it here for technical reasons :(</span>
        {/if}
        at {new Date(mention.date).toLocaleString()}{#if isMicroformatRoot(mention.mfItem?.properties?.content[0])}:
        {mention.mfItem.properties.content[0]?.value}
        {/if}
    </article>
</svelte:element>