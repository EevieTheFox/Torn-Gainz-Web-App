<script lang="ts">
    import type { ConsentState } from "$lib/consent/consent_levels";
    import { capabilitiesFromConsent } from "$lib/consent/allowed_actions";

    // Helper to create ISO timestamps
    const nowIso = () => new Date().toISOString();

    // Default consent state
    let consent: ConsentState = {
        policyVersion: "1.0.0",
        telemetryLevel: "none"
    };

    // --- API key state (optional) ---
    let apiKeyInput = "";
    let apiKeySaved: string | null = null; // TODO: load/save via encrypted local storage
    let showApiKey = false;
    type ApiStatusKind = "idle" | "ok" | "error" | "testing";
    let apiStatus: { kind: ApiStatusKind; message: string } = {
        kind: "idle",
        message: "Optional: add a key for auto-fill and tracking. Manual mode works without it.",
    };

    // Consent UI state: policy must be opened before checkbox can be ticked
    let hasOpenedPolicy = false;
    let policyConsentChecked = false;

    // Actions
    function looksLikeApiKey(key: string): boolean {
        const k = key.trim();
        if (!k) return false;
        if (k.length < 16) return false; // lenient sanity check
        return /^[a-fA-F0-9]+$/.test(k);
    }

    function saveApiKeyLocal() {
        const k = apiKeyInput.trim();

        // Blank means "no key" (still valid for manual mode)
        if (!k) {
            apiKeySaved = null;
            apiStatus = { kind: "idle", message: "No key saved. Manual mode is fully available." };
            return;
        }

        if (!looksLikeApiKey(k)) {
            apiStatus = { kind: "error", message: "Invalid API key. Please check your key and try again." };
            return;
        }

        // TODO: replace with encrypted storage per spec
        apiKeySaved = k;
        apiStatus = { kind: "ok", message: "Key saved locally. You can test it any time." };
    }

    function clearApiKey() {
        apiKeyInput = "";
        apiKeySaved = null;
        apiStatus = { kind: "idle", message: "Key cleared. Manual mode is still fully available." };
    }

    async function testApiKey() {
        const k = (apiKeySaved ?? apiKeyInput).trim();

        if (!k) {
            apiStatus = { kind: "idle", message: "No key to test — and that’s totally fine." };
            return;
        }
        if (!looksLikeApiKey(k)) {
            apiStatus = { kind: "error", message: "Invalid API key. Please check your key and try again." };
            return;
        }

        apiStatus = { kind: "testing", message: "Testing key…" };

        try {
            // TODO: wire real Torn API call
            await new Promise((r) => setTimeout(r, 350));
            apiStatus = { kind: "ok", message: "Key looks good ✅ (wire the real test call next)" };
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            apiStatus = { kind: "error", message: `Key test failed: ${msg}` };
        }
    }

    function openPolicy() {
        // Open policy page
        window.open("/policy", "_blank", "noopener,noreferrer");

        // Mark as viewed (this is your “hyperlink checked” concept)
        hasOpenedPolicy = true;

        // Store timestamp in consent state (useful for later auditing)
        consent.policyViewedAt = nowIso();
    }

    function openCalculator() {
        // Open calculator page
        window.open("/calculator", "_blank", "noopener,noreferrer");

        // Mark as viewed (this is your “hyperlink checked” concept)
        hasOpenedPolicy = true;

        // Store timestamp in consent state (useful for later auditing)
        consent.policyViewedAt = nowIso();
    }

    // Trigger for showing telemetry+consent UI: typed OR saved
    $: hasApiKey = apiKeyInput.trim().length > 0 || apiKeySaved != null;

    // When user checks consent, set consentGivenAt; when they uncheck, clear it
    $: {
        if (policyConsentChecked) {
            consent.consentGivenAt ??= nowIso();
            consent.revokedAt = undefined;
        } else {
            consent.consentGivenAt = undefined;
        }
    }

    // If consent is not checked, force telemetry back to none
    $: {
        if (!policyConsentChecked && consent.telemetryLevel !== "none") {
            consent.telemetryLevel = "none";
        }
    }


    $: caps = capabilitiesFromConsent(consent);

    // Rich telemetry toggle rules (matches your intent):
    // - rich implies basic
    // - rich only possible if consent is checked
    $: richEnabled = consent.telemetryLevel === "rich";
</script>

<svelte:head>
    <title>Torn Gainz | Home</title>
</svelte:head>

<main class="wrap">
    <header class="header">
        <h1>Welcome to Torn Gainz</h1>
        <p class="sub">The only tool you need to optimize your gym gain!</p>
    </header>

    <section class="grid">

        <!-- API UI -->
        <div class="card">
            <label class="label">Optional API Key</label>

            <div class="row">
                <p class="hint" style="margin-top:0">
                    Manual calculator mode works without a key. Add one only if you want auto-fill and (later) tracking.
                </p>

                <label class="label" for="apiKey">Torn API key (optional)</label>

                <div class="inputRow">
                    <input
                            id="apiKey"
                            type={showApiKey ? "text" : "password"}
                            bind:value={apiKeyInput}
                            placeholder="enter API key here (for auto-filled stats)"
                            autocomplete="off"
                            spellcheck="false"
                            inputmode="text"
                    />

                    <button type="button" class="btn" on:click={() => (showApiKey = !showApiKey)}>
                        {showApiKey ? "Hide" : "Show"}
                    </button>
                </div>

                <div class="actions">
                    <button type="button" class="btn" on:click={saveApiKeyLocal}>
                        Save
                    </button>

                    <button
                            type="button"
                            class="btn"
                            on:click={testApiKey}
                            disabled={!apiKeyInput.trim() && !apiKeySaved}
                    >
                        Test
                    </button>

                    <button type="button" class="btn btnDanger clearBtn" on:click={clearApiKey}>
                        Clear
                    </button>
                </div>

                <div class={"status " + apiStatus.kind}>
                    {apiStatus.message}
                </div>

                {#if apiKeySaved}
                    <p class="tiny">Saved key: <code class="code">••••••••</code> (stored locally)</p>
                {/if}

                {#if !hasApiKey}
                    <div class="centerRow">
                        <button type="button" class="btn btnCalc" on:click={openCalculator()}>
                            Go to calculator
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Consent UI - Only show once user types or enters an API Key -->
        <div class="card">
            {#if hasApiKey}

                <div class="row">
                    <label class="label">Optional analytics (off by default)</label>

                    <div class="telemetryGroup">
                        <label class="telemetryOption">
                            <input type="radio" name="telemetry" value="none" bind:group={consent.telemetryLevel} />
                            <div class="telemetryText">
                                <div class="telemetryTitle">Off</div>
                                <div class="telemetryDesc">No analytics. Manual mode and local-only storage still work.</div>
                            </div>
                        </label>

                        <label class={"telemetryOption " + (!policyConsentChecked ? "disabled" : "")}>
                            <input
                                    type="radio"
                                    name="telemetry"
                                    value="basic"
                                    bind:group={consent.telemetryLevel}
                                    disabled={!policyConsentChecked}
                            />
                            <div class="telemetryText">
                                <div class="telemetryTitle">Save my stats</div>
                                <div class="telemetryDesc">
                                    Share minimal, anonymized buckets to improve accuracy and defaults.
                                </div>
                            </div>
                        </label>

                        <label class={"telemetryOption " + (!policyConsentChecked ? "disabled" : "")}>
                            <input
                                    type="radio"
                                    name="telemetry"
                                    value="rich"
                                    bind:group={consent.telemetryLevel}
                                    disabled={!policyConsentChecked}
                            />
                            <div class="telemetryText">
                                <div class="telemetryTitle">Track my gains</div>
                                <div class="telemetryDesc">
                                    Share richer daily deltas (still opt-in) to improve comparisons and long-term insights.
                                </div>
                            </div>
                        </label>
                    </div>

                    {#if !policyConsentChecked && consent.telemetryLevel !== "none"}
                        <p class="hint">Pick “Off” or agree to the policy to enable analytics options.</p>
                    {/if}
                </div>
            {:else}
                <div class="row">
                    <label class="label">Optional analytics</label>
                    <p class="hint">
                        Add an API key to see analytics options. Manual mode doesn’t need telemetry settings.
                    </p>
                </div>
            {/if}

            {#if hasApiKey}
                <div class="row">
                    <label class="label">Read the policy</label>
                    <button type="button" class="btn btnGhost" on:click={openPolicy}>
                        View Data Retention & API Usage Policy
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
                <div class="row">
                    <button type="button" class="btn btnCalc" on:click={openCalculator()}>
                        Go to calculator
                    </button>
                </div>
            {/if}


            <hr />

            {#if hasApiKey}
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
            {/if}

            {#if richEnabled && !policyConsentChecked}
                <p class="warn">
                    Note: In the real UI, rich telemetry would also be blocked until consent is checked.
                    (Right now we’re just visualizing states.)
                </p>
            {/if}
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
        text-align: center;
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
        border: 1px solid var(--card-border);
        background: var(--card-bg);
        border-radius: 12px;
        padding: 16px;
    }


    h2 {
        margin: 0 0 12px;
    }

    .row {
        margin: 12px 0;
    }

    .centerRow {
        display: flex;
        justify-content: center;
        margin-top: 12px;
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
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid var(--card-border);
        background: var(--seg-selected-bg);
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

    inputRow {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .inputRow input {
        flex: 1;
        width: 70%;
        /* ~2x “presence” */
        padding: 16px 18px;
        font-size: 1.1rem;
        line-height: 1.1;
        border-radius: 18px;
        border: 1px solid var(--card-border);
        background: var(--card-bg);
        color: inherit;
        outline: none;
    }


    .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    .clearBtn {
        margin-left: 122px;
    }

    .btnGhost {
        padding: 6px 8px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.20);
        background: rgba(219,179,114,0.30);
        color: inherit;
        cursor: pointer;
    }

    .btnCalc {
        padding: 16px 18px;
        font-size: 1.2rem;
        border: 1px solid var(--card-border);
        background: var(--seg-selected-bg);
        color: inherit;
        cursor: pointer;
    }


    .btnDanger {
        background: rgba(255, 80, 80, 0.20);;
        border-color: rgba(255, 80, 80, 0.60);
    }

    .status {
        margin-top: 10px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(67, 150, 79, 0.60);
        background: rgba(67, 150, 79, 0.30);
        opacity: 0.95;
        text-align: center;
    }

    .status.ok {
        border-color: rgba(67, 150, 79, 0.60);
        background: rgba(67, 150, 79, 0.30);
    }

    .status.error {
        border-color: rgba(255, 80, 80, 0.60);
        background: rgba(255, 80, 80, 0.20);
    }

    .status.testing {
        opacity: 0.85;
    }

    .telemetryGroup {
        display: grid;
        gap: 10px;
        margin-top: 6px;
    }

    .telemetryOption {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.04);
        cursor: pointer;
    }

    .telemetryOption input {
        margin-top: 2px;
    }

    .telemetryText {
        display: grid;
        gap: 4px;
    }

    .telemetryTitle {
        font-weight: 700;
    }

    .telemetryDesc {
        opacity: 0.85;
        line-height: 1.25rem;
    }

    .telemetryOption.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .tiny {
        margin: 8px 0 0;
        font-size: 0.9rem;
        opacity: 0.75;
    }

</style>
