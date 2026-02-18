<script lang="ts">
    import { POLICY_TEXT, POLICY_VERSION, POLICY_VALID_AS_OF } from "$lib/policy/policy_v1_0_0";
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
        <pre class="preWrap">{POLICY_TEXT}</pre>
    </article>
</main>
