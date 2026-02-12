<script lang="ts">
    import SegmentedControl from '$lib/components/SegmentedControl.svelte';
    import {
        createInitialState,
        selectJumpType,
        selectManualScaffold,
        selectInputMode,
        setJumpsCount,
        type JumpType,
        type ManualScaffold,
        type InputMode,
        type CalcUIState
    } from '$lib/calculator/calc_ui_state';
    import { getUiConsentState } from '$lib/consent/consent_ui_adapter';
    import type { ConsentState } from '$lib/consent/consent_levels';

    let state: CalcUIState = createInitialState({
        // placeholder until API key storage exists
        hasApiKey: false
    });

    const jumpTypeOptions = [
        { value: 'manual', label: 'Manual' },
        { value: 'candy', label: 'Candy' },
        { value: 'edvd', label: 'EDVD' },
        { value: '99k', label: '99k' }
    ] satisfies { value: JumpType; label: string }[];

    const scaffoldOptions = [
        { value: 'candy', label: 'Candy' },
        { value: 'edvd', label: 'EDVD' },
        { value: '99k', label: '99k' }
    ] satisfies { value: ManualScaffold; label: string }[];

    const consent: ConsentState = {
        policyVersion: '1.0.0',
        telemetryLevel: 'none'
    };

    $: inputModeOptions = [
        { value: 'auto', label: 'Auto', disabled: !state.hasApiKey },
        { value: 'manual', label: 'Manual' }
    ] satisfies { value: InputMode; label: string; disabled?: boolean }[];

    $: uiConsent = getUiConsentState({ consent, hasApiKey: state.hasApiKey });

    function onSelectJumpType(v: JumpType) {
        state = selectJumpType(state, v);
    }

    function onSelectScaffold(v: ManualScaffold) {
        state = selectManualScaffold(state, v);
    }

    function onSelectInputMode(v: InputMode) {
        state = selectInputMode(state, v);
    }
</script>

<svelte:head>
    <title>Torn Gainz | Home</title>
</svelte:head>

<section class="calc-page">
    <header class="calc-header">
        <h1>Calculator</h1>

        <div class="chips">
            <span class="chip">{uiConsent.consentLevelLabel}</span>
            <span class="chip">{state.hasApiKey ? 'API Key: Present' : 'API Key: Missing'}</span>
        </div>

        <div class="control-area">
            <div class="row row-center">
                <div class="control-row">
                    <div class="left"></div>
                    <div class="mid">
                        <div class="row-label centered">Jump Calculation Type</div>
                        <div class="row-controls">
                            <div class="center">
                                <!-- We’ll wire clicks manually for clarity -->
                                <div class="seg-wrap">
                                    {#each jumpTypeOptions as opt (opt.value)}
                                        <button
                                            type="button"
                                            class="segbtn {state.jumpType === opt.value ? 'selected' : ''}"
                                            on:click={() => onSelectJumpType(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    {/each}
                                </div>
                            </div>


                        </div>
                    </div>

                    <div class="right-jumps">
                        <label class="mini-label" for="jumps"># of jumps</label>
                        <input
                                id="jumps"
                                class="jumps"
                                type="number"
                                min="1"
                                step="1"
                                value={state.jumpsCount}
                                on:input={(e) => (state = setJumpsCount(state, Number((e.target as HTMLInputElement).value)))}
                        />
                    </div>
                </div>
            </div>

            <div class="row row-center">
                {#if state.jumpType === 'manual'}
                    <div class="control-row">
                        <div class="left"></div>
                        <div class="mid">
                            <div class="row-label centered">Jump Style</div>
                            <div class="seg-wrap small">
                                {#each scaffoldOptions as opt (opt.value)}
                                    <button
                                            type="button"
                                            class="segbtn sm {state.manualScaffold === opt.value ? 'selected' : ''}"
                                            on:click={() => onSelectScaffold(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        <div class="right meta">
                            <span class="meta-item">Manual inputs (no live snapshot)</span>
                        </div>
                    </div>

                {:else}
                    <div class="row-controls">
                        <div class="center">
                            <div class="control-row">
                                <div class="left"></div>

                                <div class="mid">
                                    <div class="row-label centered">Input Mode</div>
                                    <div class="seg-wrap small">
                                        <button
                                                type="button"
                                                class="segbtn sm {state.inputMode === 'auto' ? 'selected' : ''}"
                                                disabled={!uiConsent.canUseAutoMode}
                                                on:click={() => onSelectInputMode('auto')}
                                        >
                                            Auto
                                        </button>
                                        <button
                                                type="button"
                                                class="segbtn sm {state.inputMode === 'manual' ? 'selected' : ''}"
                                                on:click={() => onSelectInputMode('manual')}
                                        >
                                            Manual
                                        </button>
                                    </div>

                                    {#if !uiConsent.canUseAutoMode}
                                        <div class="hint centered">API key required for Auto</div>
                                    {/if}
                                </div>

                                <div class="right metaAuto">
                                    {#if state.snapshotAt}
                                        <span class="meta-item">Accurate as of: {state.snapshotAt.toLocaleString()}</span>
                                    {:else}
                                        <span class="meta-item">No snapshot yet</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            {#if state.lastNotice}
                <div class="notice">{state.lastNotice}</div>
            {/if}

        </div>
    </header>

    <!-- Cards layout skeleton -->
    <div class="grid">
        <!-- Row 1: User Information -->
        <div class="row3">
            <div class="card"><h2>User Information</h2><div class="placeholder">Left: Max happy, property type/perks, preference</div></div>
            <div class="card"><h2>Battle Stats</h2><div class="placeholder">Middle: stats + current gym</div></div>
            <div class="card"><h2>Perks</h2><div class="placeholder">Right: faction/edu/job perks</div></div>
        </div>

        <!-- Row 2: Item Information -->
        <div class="row3">
            <div class="card"><h2>Requirements</h2><div class="placeholder">Left: requirements + total happy</div></div>
            <div class="card"><h2>Inventory</h2><div class="placeholder">Center: inventory + delta</div></div>
            <div class="card"><h2>Market / Total</h2><div class="placeholder">Right: values + per-item totals + GRAND TOTAL</div></div>
        </div>

        <!-- Row 3: Overrides (hidden in Manual) -->
        {#if state.jumpType !== 'manual'}
            <div class="card full">
                <div class="card-header">
                    <h2>Customization</h2>
                    <button type="button" class="linkish">Expand</button>
                </div>
                <div class="placeholder">Collapsed overrides bar (stats / perks / items) for Auto modes</div>
            </div>
        {/if}

        <!-- Bottom Row: Results -->
        <div class="card full">
            <div class="card-header">
                <h2>Results</h2>
            </div>
            <div class="row3">
                <div class="subcard">
                    <div class="placeholder">Left: energy, energy/train, total happy, total cost, gains per million</div>
                </div>
                <div class="subcard">
                    <div class="placeholder">Center: trains + gains/train (per stat)</div>
                </div>
                <div class="subcard">
                    <div class="placeholder">Right: totals + grand total gains + gains/million + Calculate/Recalculate</div>
                    <div class="cta">
                        <button type="button" class="primary">
                            {state.jumpType === 'manual' || !state.snapshotAt ? 'Calculate' : 'Recalculate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="disclaimer">Estimates only. Actual gains and costs may vary based on perks, timing, and market conditions.</div>
    </div>
</section>

<style>
    .calc-page {
        padding: 18px 16px 28px;
        max-width: 1240px;
        margin: 0 auto;
    }

    .calc-header h1 {
        margin: 6px 0 12px;
    }

    .hint {
        font-size: 0.85em;
        opacity: 0.65;
    }

    .row {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .row-label {
        opacity: 0.8;
        font-size: 0.95em;
    }

    .control-area {
        display: flex;
        flex-direction: column;
        gap: 16px; /* a bit more breathing room */
    }

    .control-row {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 12px;
    }

    .control-row .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .control-row .left {
        /* intentional spacer */
    }

    .control-row .right {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
    }

    .row-label.centered {
        text-align: center;
    }

    .right {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
    }

    .right-jumps{
        margin-top: auto;
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
    }

    .mini-label {
        opacity: 0.7;
        font-size: 0.85em;
    }

    .jumps {
        width: 84px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        color: inherit;
    }

    .meta {
        margin-top: 25px;
        opacity: 0.75;
        font-size: 0.9em;
    }

    .metaAuto {
        margin-top: 10px;
        opacity: 0.75;
        font-size: 0.9em;
    }

    .meta-item {
        white-space: nowrap;
    }

    .seg-wrap {
        display: inline-flex;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 14px;
        overflow: hidden;
        background: rgba(255,255,255,0.03);
    }
    .seg-wrap.small {
        border-radius: 12px;
    }

    .segbtn {
        border: none;
        background: transparent;
        color: inherit;
        padding: 10px 14px;
        cursor: pointer;
        font: inherit;
        opacity: 0.9;
    }
    .segbtn.sm {
        padding: 7px 10px;
        font-size: 0.92em;
    }

    .segbtn:hover {
        background: rgba(255,255,255,0.05);
    }

    .segbtn.selected {
        background: rgba(255,255,255,0.10);
        opacity: 1;
    }

    .segbtn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .notice {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.04);
        padding: 10px 12px;
        border-radius: 12px;
        font-size: 0.95em;
        opacity: 0.9;
    }

    .grid {
        display: flex;
        flex-direction: column;
        gap: 14px; margin-top: 16px;
    }

    .row3 {
        display: grid;
        grid-template-columns:
                repeat(3, 1fr);
        gap: 14px;
    }

    .card {
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        border-radius: 16px;
        padding: 14px;
    }

    .card h2 {
        margin: 0 0 10px;
        font-size: 1.05em;
        opacity: 0.95;
    }

    .card.full {
        width: 97%;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .linkish {
        border: none;
        background: none;
        color: inherit;
        opacity: 0.8;
        cursor: pointer;
        text-decoration: underline;
    }

    .subcard {
        border: 1px dashed rgba(255,255,255,0.16);
        border-radius: 14px;
        padding: 12px;
        min-height: 110px;
    }

    .chips {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        align-items: center;
        margin-top: 8px;
    }

    .chip {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.04);
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.85em;
        opacity: 0.9;
        white-space: nowrap;
    }

    .placeholder {
        opacity: 0.7;
        font-size: 0.95em;
    }

    .cta {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }

    .primary {
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.08);
        color: inherit;
        padding: 10px 14px;
        border-radius: 12px;
        cursor: pointer;
    }
    .primary:hover {
        background: rgba(255,255,255,0.12);
    }

    .disclaimer {
        text-align: center;
        opacity: 0.65;
        font-size: 0.9em;
        margin-top: 6px;
    }

    @media (max-width: 980px) {
        .row3 { grid-template-columns: 1fr; }
        .row-controls { grid-template-columns: 1fr; }
        .right { justify-content: center; }
    }
</style>
