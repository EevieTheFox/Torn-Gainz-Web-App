<script lang="ts">
    import aboutMD from '$lib/about/ABOUT.md?raw';
    import { marked } from 'marked';

    marked.setOptions({
        gfm: true,
        breaks: false
    })

    const html = marked.parse(aboutMD);
</script>

<svelte:head>
    <title>About Torn Gainz</title>
</svelte:head>

<main class="page">
    <header class="pageHeader">
        <h1>About Torn Gainz</h1>
    </header>

    <div class="card">
        <article class="prose prose-invert max-w-none">
            {@html html}
        </article>
    </div>
</main>
