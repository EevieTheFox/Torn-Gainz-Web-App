<script lang="ts">
  import { POLICY_TEXT, POLICY_VERSION, POLICY_VALID_AS_OF } from "$lib/policy/policy_v1_0_0";
</script>

<svelte:head>
  <title>Torn Gainz — Data Policy</title>
</svelte:head>

<main class="wrap">
  <header class="header">
    <h1>Data Retention, Fair Use, and API Usage Policy</h1>
    <p class="meta">Policy Version {POLICY_VERSION} — Valid as of {POLICY_VALID_AS_OF}</p>
  </header>

  <article class="policy">
    <!-- preserves spacing + line breaks exactly -->
    <pre>{POLICY_TEXT}</pre>
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

  .meta {
      text-align: center;
      margin: 0 0 24px;
      opacity: 0.8;
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
