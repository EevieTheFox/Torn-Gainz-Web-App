<script lang="ts">
    import POLICY from '$lib/content/policy/POLICY_v1_1_0.md';
    import { marked } from 'marked';
    import { POLICY_VERSION, POLICY_VALID_AS_OF } from "$lib/policy/policy_v1_0_0";

    const html = marked.parse(POLICY);
</script>

<svelte:head>
    <title>Torn Gainz — Data Policy</title>
</svelte:head>

<main class="page">
    <header class="pageHeader">
        <h1>Data Retention, Fair Use, and API Usage Policy</h1>
        <p class="meta">Policy Version {POLICY_VERSION} — Valid as of {POLICY_VALID_AS_OF}</p>
    </header>

    <article class="card">
        <pre class="preWrap">
            <article class="prose">
                {@html html}
            </article>
        </pre>
    </article>
</main>
