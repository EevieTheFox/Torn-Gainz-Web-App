<script lang="ts">
    import { ABOUT_TEXT} from "$lib/About/about";
</script>

<svelte:head>
    <title>About Torn Gainz</title>
</svelte:head>

<main class="wrap">
    <header class="header">
        <h1>About Torn Gainz</h1>
    </header>

    <article class="policy">
        <!-- preserves spacing + line breaks exactly -->
        <pre>{ABOUT_TEXT}</pre>
    </article>
</main>

<style>
    .wrap {
        max-width: 900px;
        margin: 0 auto;
        padding: 24px 16px 64px;
    }

    .header h1 {
        margin: 0 0 8px;
    }


    .policy {
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        padding: 16px;
    }

    pre {
        margin: 0;
        white-space: pre-wrap;  /* wrap long lines */
        word-break: break-word; /* avoid horizontal scroll */
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        line-height: 1.4;
    }
</style>