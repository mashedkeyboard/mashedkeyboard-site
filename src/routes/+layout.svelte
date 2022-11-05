<script>
    import '$lib/scss/app.scss';

    import Header from '$lib/Header.svelte';

    import socialimg from '../assets/img/social.jpg';

    import { page } from '$app/stores';
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

<main>
    <Header heading={$page.data.heading || null}/>
    <slot></slot>
</main>
  