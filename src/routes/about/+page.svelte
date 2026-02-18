<script lang="ts">
    import { ABOUT_TEXT } from "$lib/about/about";
</script>

<svelte:head>
    <title>About Torn Gainz</title>
</svelte:head>

<main class="wrap">
    <header class="header">
        <h1>About Torn Gainz</h1>
    </header>

    <article class="about">
        <!-- preserves spacing + line breaks exactly -->
        <pre>{ABOUT_TEXT}</pre>
    </article>
</main>
