<script>
    import '../app.scss';

    import Header from '$lib/components/Header.svelte';

    import Console from '$lib/components/Console.svelte';

    import socialimg from '../assets/img/social.jpg';

    import { page } from '$app/stores';
	import { urlFor } from '$lib/Helpers';

    /**
     * Controls whether the console is visible or not.
     * Originates from Console.svelte, bound in here.
     * @type {boolean}
     */
    let showConsole;

    /**
     * Handles checking for console opening.
	 * @param {KeyboardEvent} e
	 */
    function handleKeydown(e) {
        if(e.key === "`" && !showConsole) {
            e.preventDefault();
            showConsole = true;
        }
    }

    const canonicalPath = urlFor($page.url.pathname);
</script>

<svelte:head>
    <title>{$page.data.meta_title}</title>

    <link rel="canonical" href={canonicalPath}>

	<meta property="og:type" content="{$page.data.open_graph_type || 'website'}">
    <meta property="og:url" content={canonicalPath}>
    <meta property="og:image" content={$page.data.social_image || socialimg}>
    <meta property="og:title" content="{$page.data.social_title || $page.data.meta_title}">
    <meta property="og:description" content={$page.data.description}>
    {#if $page.data.open_graph}
        {#each Object.entries($page.data.open_graph) as ogData}
        <meta property="og:{ogData[0]}" content={ogData[1]}>
        {/each}
    {/if}

    <meta name="description" content={$page.data.description} />
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>

<a href="#content" class="skip-link">Skip to main content</a>

<div class="container">
    <Header heading={$page.data.heading || null} on:easter={(e) => showConsole = true} />
    <main id="content">
        <slot></slot>
    </main>
</div>

<Console bind:showConsole={showConsole} />