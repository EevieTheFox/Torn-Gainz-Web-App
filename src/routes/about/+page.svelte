<script lang="ts">
    import { ABOUT_TEXT } from "$lib/about/about";
</script>

<svelte:head>
    <title>About Torn Gainz</title>
</svelte:head>

<main class="page">
    <header class="pageHeader">
        <h1>About Torn Gainz</h1>
    </header>

    <article class="card">
        <pre class="preWrap">{ABOUT_TEXT}</pre>
    </article>
</main>
