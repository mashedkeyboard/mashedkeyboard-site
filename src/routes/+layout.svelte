<script>
    import globalStyles from '$lib/scss/global.scss?inline';

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

    <svelte:element this="style" type="text/css">{globalStyles}</svelte:element>

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

<style lang="scss">
    a.skip-link {
        position: absolute;
        top: -3em;

        background: $dark;
        color: $light;
        @include light-mode {
            background-color: $light;
            color: $dark;
        }

        &:focus {
            top: 0;
        }
    }
    
    .container {
        max-width: $tablet_break;
        width: 100vw;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    
        background: $dark;

        @include light-mode {
            background-color: $light;
            color: $dark;
        }
    
        @media screen and (min-width: $tablet_break) {
            border-radius: 1rem;
            min-height: 0;
        }
    
        @media screen and (min-width: $tablet_break) {
            margin: 2em 0;
            filter: drop-shadow(0 0 2rem rgba($primary_dark, 0.8));
        }
    
        :global {
            &> * {
                padding: 0.5rem 3rem 0.5rem 3rem;
                margin: 0;
            
                z-index: 1;
            
                &:not(:first-child) {
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                    z-index: 10;
                }
            
                &:nth-child(2) {
                    padding-top: 1rem;
                }
            
                &:not(:last-child) {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }
            
                &:last-child {
                    padding-bottom: 1.5em;
                    flex-grow: 1;
                }
            
                h1 {
                    font-size: 3.2rem;
                    line-height: 1.1;
                }
            
                .flex-30 {
                    flex: 30%;
                }
                
                .flex-50 {
                    flex: 50%;
                }
            }
        }
    }
</style>