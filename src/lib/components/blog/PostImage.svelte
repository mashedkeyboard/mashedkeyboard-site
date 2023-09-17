<script lang="ts">
	import type { Post } from "$lib/blog/Post";

    export let post: Post;
    export let headerBg: boolean = false;
</script>

{#if post.getImage()}
    <picture class:headerBg>
        <source type="image/avif" srcset={post.getImage()?.avifSrcsetImage} />
        <source type="image/webp" srcset={post.getImage()?.webpSrcsetImage} />
        <img src={post.getImage()?.fallbackImage} alt="{post.getImage()?.alt}" class="u-photo" />
    </picture>
{/if}

<style lang="scss">
    picture {
        &.headerBg {
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
        }

        img {
            object-fit: cover;
            width: 100%;
        }
    }
</style>