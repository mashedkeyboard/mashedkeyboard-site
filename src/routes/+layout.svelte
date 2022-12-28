<script>
    import '$lib/scss/app.scss';

    import Header from '$lib/Header.svelte';

    import Console from '$lib/Console.svelte';

    import socialimg from '../assets/img/social.jpg';

    import { page } from '$app/stores';

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
</script>

<svelte:head>
    <title>{$page.data.title}</title>

	<meta property="og:type" content="website">
    <meta property="og:url" content="https://mashedkeyboard.me{$page.route.id}">
    <meta property="og:image" content={socialimg}>
    <meta property="og:title" content="{$page.data.social_title || $page.data.title}">
    <meta property="og:description" content={$page.data.description}>

    <meta name="description" content={$page.data.description} />
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>

<main>
    <Header heading={$page.data.heading || null} on:easter={(e) => showConsole = true} />
    <slot></slot>
</main>

<Console bind:showConsole={showConsole} />