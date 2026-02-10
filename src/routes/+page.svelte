<script lang="ts">
    import type { ConsentState } from "$lib/consent/consent_levels";
    import { capabilitiesFromConsent } from "$lib/consent/allowed_actions";

    // Helper to create ISO timestamps
    const nowIso = () => new Date().toISOString();

    let consent: ConsentState = {
        policyVersion: "1.0.0",
        telemetryLevel: "none"
    };

    // UI state: policy must be opened before checkbox can be ticked
    let hasOpenedPolicy = false;
    let policyConsentChecked = false;

    function openPolicy() {
        // Open policy page
        window.open("/policy", "_blank", "noopener,noreferrer");

        // Mark as viewed (this is your “hyperlink checked” concept)
        hasOpenedPolicy = true;

        // Store timestamp in consent state (useful for later auditing)
        consent.policyViewedAt = nowIso();
    }

    // When user checks consent, set consentGivenAt; when they uncheck, clear it
    $: {
        if (policyConsentChecked) {
            consent.consentGivenAt ??= nowIso();
            consent.revokedAt = undefined;
        } else {
            consent.consentGivenAt = undefined;
        }
    }

    $: caps = capabilitiesFromConsent(consent);

    // Rich telemetry toggle rules (matches your intent):
    // - rich implies basic
    // - rich only possible if consent is checked
    $: richEnabled = consent.telemetryLevel === "rich";
</script>

<svelte:head>
    <title>Torn Gainz — Dev Playground</title>
</svelte:head>

<main class="wrap">
    <header class="header">
        <h1>Torn Gainz — Dev Playground</h1>
        <p class="sub">Wiring the policy page into the consent flow.</p>
    </header>

    <section class="grid">
        <div class="card">
            <h2>Consent Controls</h2>

            <div class="row">
                <label class="label">Telemetry level</label>
                <select bind:value={consent.telemetryLevel}>
                    <option value="none">none</option>
                    <option value="basic">basic</option>
                    <option value="rich">rich</option>
                </select>
            </div>

            <div class="row">
                <label class="label">Read the policy</label>
                <button type="button" class="btn" on:click={openPolicy}>
                    View Data Retention & API Usage Policy (/policy)
                </button>
            </div>

            <div class="row">
                <label class="label">Consent to data policy</label>
                <label class="check">
                    <input
                            type="checkbox"
                            bind:checked={policyConsentChecked}
                            disabled={!hasOpenedPolicy}
                    />
                    <span>
            I have read and agree to the Data Retention, Fair Use, and API Usage Policy
          </span>
                </label>
                {#if !hasOpenedPolicy}
                    <p class="hint">Disabled until you open the policy page.</p>
                {/if}
            </div>

            <hr />

            <div class="row">
                <label class="label">Policy viewed at</label>
                <code class="code">{consent.policyViewedAt ?? "—"}</code>
            </div>

            <div class="row">
                <label class="label">Consent given at</label>
                <code class="code">{consent.consentGivenAt ?? "—"}</code>
            </div>

            <div class="row">
                <label class="label">Revoked at</label>
                <code class="code">{consent.revokedAt ?? "—"}</code>
            </div>

            {#if richEnabled && !policyConsentChecked}
                <p class="warn">
                    Note: In the real UI, rich telemetry would also be blocked until consent is checked.
                    (Right now we’re just visualizing states.)
                </p>
            {/if}
        </div>

        <div class="card">
            <h2>Derived Capabilities</h2>
            <pre>{JSON.stringify(caps, null, 2)}</pre>
        </div>
    </section>
</main>

<style>
    .wrap {
        max-width: 1000px;
        margin: 0 auto;
        padding: 24px 16px 64px;
    }

    .header h1 {
        margin: 0 0 6px;
    }

    .sub {
        margin: 0 0 20px;
        opacity: 0.8;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
    }

    @media (min-width: 900px) {
        .grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    .card {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 16px;
    }

    h2 {
        margin: 0 0 12px;
    }

    .row {
        margin: 12px 0;
    }

    .label {
        display: block;
        font-weight: 600;
        margin-bottom: 6px;
    }

    select {
        width: 100%;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.18);
        background: transparent;
        color: inherit;
    }

    .btn {
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.06);
        color: inherit;
        cursor: pointer;
    }

    .btn:hover {
        background: rgba(255,255,255,0.10);
    }

    .check {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        line-height: 1.3;
    }

    .hint {
        margin: 6px 0 0;
        opacity: 0.75;
        font-size: 0.95rem;
    }

    .warn {
        margin-top: 10px;
        opacity: 0.9;
    }

    .code {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 8px;
        background: rgba(255,255,255,0.06);
    }

    pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
    }

    hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        margin: 16px 0;
    }
</style>
