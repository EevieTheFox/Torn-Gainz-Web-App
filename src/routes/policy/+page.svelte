<script lang="ts">
    import policyMD from '$lib/policy/POLICY_v1_1_1.md?raw';
    import { marked } from 'marked';
    import { POLICY_VERSION, POLICY_VALID_AS_OF } from "$lib/policy/policy_v1_1_1.ts";

    marked.setOptions({
        gfm: true,
        breaks: false
    })

    const html = marked.parse(policyMD);
</script>

<svelte:head>
    <title>Torn Gainz — Data Policy</title>
</svelte:head>

<main class="page">
    <header class="pageHeader">
        <h1>Data Retention, Fair Use, and API Usage Policy</h1>
        <p class="meta">Policy Version {POLICY_VERSION} — Valid as of {POLICY_VALID_AS_OF}</p>
    </header>

    <div class="card">
        <article class="prose prose-invert max-w-none">
            {@html html}
        </article>
    </div>
</main>
