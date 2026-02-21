<script lang="ts">

    // Import for top controls - jump type and auto/manual modes
    import SegmentedControl from '$lib/components/SegmentedControl.svelte';
    import {
        selectJumpType,
        selectManualScaffold,
        selectInputMode,
        setJumpsCount,
        createInitialState,
        setField,
        type JumpType,
        type ManualScaffold,
        type InputMode,
        type CalcUIState
    } from '$lib/calculator/calc_ui_state';

    // Import consent value to enable/disable auto mode
    import { POLICY_VERSION } from "$lib/policy/policy_version.ts";
    import { getUiConsentState } from '$lib/consent/consent_ui_adapter';
    import type { ConsentState } from '$lib/consent/consent_levels';

    // Import calculator UI fields
    import { F, numToInput, getStr } from '$lib/calculator/calc_fields';

    // determines UI fields from createInitialState
    let ui: CalcUIState = createInitialState({
        // placeholder until API key storage exists
        hasApiKey: false
    });

    // Top segmented control buttons
    const jumpTypeOptions = [
        { value: 'manual', label: 'Manual' },
        { value: 'candy', label: 'Candy' },
        { value: 'edvd', label: 'EDVD' },
        { value: '99k', label: '99k' }
    ] satisfies { value: JumpType; label: string }[];

    // Bottom segmented control buttons
    const scaffoldOptions = [
        { value: 'candy', label: 'Candy' },
        { value: 'edvd', label: 'EDVD' },
        { value: '99k', label: '99k' }
    ] satisfies { value: ManualScaffold; label: string }[];

    // Level of consent display
    const consent: ConsentState = {
        policyVersion: POLICY_VERSION,
        telemetryLevel: 'none'
    };

    // UI Field Constants
    const num = (id: string, fallback = 0) => {
        const v = ui.fields[id];
        return typeof v === 'number' ? v : fallback;
    };

    $: inputModeOptions = [
        { value: 'auto', label: 'Auto', disabled: !ui.hasApiKey },
        { value: 'manual', label: 'Manual' }
    ] satisfies { value: InputMode; label: string; disabled?: boolean }[];

    $: uiConsent = getUiConsentState({ consent, hasApiKey: ui.hasApiKey });

    // Selections from segmented controls dictate UI Fields
    function onSelectJumpType(v: JumpType) {
        ui = selectJumpType(ui, v);
    }

    function onSelectScaffold(v: ManualScaffold) {
        ui = selectManualScaffold(ui, v);
    }

    function onSelectInputMode(v: InputMode) {
        ui = selectInputMode(ui, v);
    }

    // Readers for UI fields
    function onNum(id: string, e: Event) {
        const raw = (e.currentTarget as HTMLInputElement).value.trim();
        const v = raw === '' ? null : Number(raw);
        ui = setField(ui, id, Number.isFinite(v as number) ? (v as number) : null);
    }

    function onStr(id: string, e: Event) {
        const raw = (e.currentTarget as HTMLInputElement).value;
        ui = setField(ui, id, raw);
    }
</script>

<svelte:head>
    <title>Torn Gainz | Home</title>
</svelte:head>

<section class="page wide">
    <header class="pageHeader">
        <h1>Gainz Calculator</h1>

        <div class="chips">
            <span class="chips-label">Privacy</span>
            <span class="chip">{uiConsent.consentLevelLabel}</span>
            <span class="chip">{ui.hasApiKey ? 'API Key: Present' : 'API Key: Missing'}</span>
        </div>

        <div class="control-area">
            <div class="field row-center">
                <div class="control-row">
                    <div class="left"></div>
                    <div class="mid">
                        <div class="fieldLabel centered">Jump Calculation Type</div>
                        <div class="row-controls">
                            <div class="center">
                                <!-- We’ll wire clicks manually for clarity -->
                                <div class="seg-wrap">
                                    {#each jumpTypeOptions as opt (opt.value)}
                                        <button
                                            type="button"
                                            class="segbtn {ui.jumpType === opt.value ? 'selected' : ''}"
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
                                value={ui.jumpsCount}
                                on:input={(e) => (ui = setJumpsCount(ui, Number((e.target as HTMLInputElement).value)))}
                        />
                    </div>
                </div>
            </div>

            <div class="field row-center">
                {#if ui.jumpType === 'manual'}
                    <div class="control-row">
                        <div class="left"></div>
                        <div class="mid">
                            <div class="fieldLabel centered">Jump Style</div>
                            <div class="seg-wrap small">
                                {#each scaffoldOptions as opt (opt.value)}
                                    <button
                                            type="button"
                                            class="segbtn sm {ui.manualScaffold === opt.value ? 'selected' : ''}"
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
                    <div class="control-row">
                        <div class="left"></div>

                        <div class="mid">
                            <div class="fieldLabel centered">Input Mode</div>
                            <div class="seg-wrap small">
                                <button
                                        type="button"
                                        class="segbtn sm {ui.inputMode === 'auto' ? 'selected' : ''}"
                                        disabled={!uiConsent.canUseAutoMode}
                                        on:click={() => onSelectInputMode('auto')}
                                >
                                    Auto
                                </button>
                                <button
                                        type="button"
                                        class="segbtn sm {ui.inputMode === 'manual' ? 'selected' : ''}"
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
                            {#if ui.snapshotAtMs}
                                <span class="meta-item">Accurate as of: {ui.snapshotAtMs.toLocaleString()}</span>
                            {:else}
                                <span class="meta-item">No snapshot yet</span>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>

            {#if ui.lastNotice}
                <div class="notice">{ui.lastNotice}</div>
            {/if}

        </div>
    </header>

    <!-- Cards layout skeleton -->
    <div class="stack">

        <!-- Row 1: User Information -->
        <div class="row3">
            <!----Left Card - User happy, property, property perks, and preferences ----->
            <div class="card">
                <h2>User Information</h2>
                <div class="inputRowCalc">
                    <label>Property Type</label>
                    <input
                        label="Prop Type"
                        value={numToInput(ui, F.USER_PROPERTY_TYPE)}
                        on:input={(e) => onNum(F.USER_PROPERTY_TYPE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Property Upgrades</label>
                    <input
                        label="Prop Upgrades"
                        value={numToInput(ui, F.USER_PROPERTY_UPGRADES)}
                        on:input={(e) => onNum(F.USER_PROPERTY_UPGRADES, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Maximum Natural Happy</label>
                    <input
                            label="Max Nat Happy"
                            value={numToInput(ui, F.USER_MAX_HAPPY)}
                            on:input={(e) => onNum(F.USER_MAX_HAPPY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Gym</label>
                    <input
                            label="Gym"
                            value={numToInput(ui, F.USER_GYM)}
                            on:input={(e) => onNum(F.USER_GYM, e)}
                    />
                </div>
            </div>

            <!----Middle Card - User Stats ----->
            <div class="card">
                <h2>Current Battle Stats</h2>
                <div class="inputRowCalc">
                    <label>Current Strength</label>
                    <input
                            label="Current Strength"
                            value={numToInput(ui, F.USER_BATTLE_STRENGTH)}
                            on:input={(e) => onNum(F.USER_BATTLE_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Defense</label>
                    <input
                            label="Current Defense"
                            value={numToInput(ui, F.USER_BATTLE_DEFENSE)}
                            on:input={(e) => onNum(F.USER_BATTLE_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Speed</label>
                    <input
                            label="Current Speed"
                            value={numToInput(ui, F.USER_BATTLE_SPEED)}
                            on:input={(e) => onNum(F.USER_BATTLE_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Dexterity</label>
                    <input
                            label="Current Dexterity"
                            value={numToInput(ui, F.USER_BATTLE_DEXTERITY)}
                            on:input={(e) => onNum(F.USER_BATTLE_DEXTERITY, e)}
                    />
                </div>
            </div>

            <!----User faction, education, and job perks ----->
            <div class="card">
                <h2>About This Calculator</h2>
                <div class="placeholder">
                    Prose about the calculator
                </div>
            </div>
        </div>

        <!-- Row 2: User Perks -->
        <div class="row3">
            <div class="card">
                <h2>Faction Perks</h2>
                <div class="inputRowCalc">
                    <label>Strength Steadfast</label>
                    <input
                            label="Strength Steadfast"
                            value={numToInput(ui, F.FACTION_STEADFAST_STRENGTH)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Defense Steadfast</label>
                    <input
                            label="Defense Steadfast"
                            value={numToInput(ui, F.FACTION_STEADFAST_DEFENSE)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Speed Steadfast</label>
                    <input
                            label="Speed Steadfast"
                            value={numToInput(ui, F.FACTION_STEADFAST_SPEED)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Dexterity Steadfast</label>
                    <input
                            label="Dexterity Steadfast"
                            value={numToInput(ui, F.FACTION_STEADFAST_DEXTERITY)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_DEXTERITY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Cooldown Limit</label>
                    <input
                            label="Cooldown Limit"
                            value={numToInput(ui, F.FACTION_COOLDOWN_BOOST)}
                            on:input={(e) => onNum(F.FACTION_COOLDOWN_BOOST, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Candy Happy Boost</label>
                    <input
                            label="Candy Happy Boost"
                            value={numToInput(ui, F.FACTION_CANDY_BOOST)}
                            on:input={(e) => onNum(F.FACTION_CANDY_BOOST, e)}
                    />
                </div>
            </div>

            <div class="card">
                <h2>Education Perks</h2>
                <div class="inputRowCalc">
                    <label>Strength Boost</label>
                    <input
                            label="Strength Boost"
                            value={numToInput(ui, F.USER_EDUCATION_STRENGTH)}
                            on:input={(e) => onNum(F.USER_EDUCATION_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Defense Boost</label>
                    <input
                            label="Defense Boost"
                            value={numToInput(ui, F.USER_EDUCATION_DEFENSE)}
                            on:input={(e) => onNum(F.USER_EDUCATION_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Speed Boost</label>
                    <input
                            label="Speed Boost"
                            value={numToInput(ui, F.USER_EDUCATION_SPEED)}
                            on:input={(e) => onNum(F.USER_EDUCATION_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Dexterity Boost</label>
                    <input
                            label="Dexterity Boost"
                            value={numToInput(ui, F.USER_EDUCATION_DEXTERITY)}
                            on:input={(e) => onNum(F.USER_EDUCATION_DEXTERITY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>All Stat Boost</label>
                    <input
                            label="All Boost"
                            value={numToInput(ui, F.USER_EDUCATION_ALL)}
                            on:input={(e) => onNum(F.USER_EDUCATION_ALL, e)}
                    />
                </div>
            </div>

            <div class="card">
                <h2>Job Perks</h2>
                <div class="inputRowCalc">
                    <label>Company Type</label>
                    <input
                            label="Company Type"
                            value={numToInput(ui, F.USER_JOB)}
                            on:input={(e) => onNum(F.USER_JOB, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Company Stars</label>
                    <input
                            label="Company Stars"
                            value={numToInput(ui, F.USER_JOB_LEVEL)}
                            on:input={(e) => onNum(F.USER_JOB_LEVEL, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Company Perk</label>
                    <input
                            label="Company Perk"
                            value={numToInput(ui, F.USER_JOB_BOOST_TYPE)}
                            on:input={(e) => onNum(F.USER_JOB_BOOST_TYPE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Perk Amount</label>
                    <input
                            label="Perk Amount"
                            value={numToInput(ui, F.USER_JOB_BOOST_LEVEL)}
                            on:input={(e) => onNum(F.USER_JOB_BOOST_LEVEL, e)}
                    />
                </div>
            </div>
        </div>

        <!-- Row 3: Item Information -->
        <div class="row3">
            <div class="card">
                <h2>Requirements</h2>
                <div class="inputRowItem itemsHeaderRow">
                    <div class="itemsHeader">Items</div>
                    <div class="colHeader">Quantity Needed</div>
                    <div class="colHeader">Happy Per Item</div>
                </div>

                <div class="inputRowItem">
                    <label>Feathery Hotel Coupon</label>
                    <input
                            label="Feathery Hotel Coupon"
                            value={numToInput(ui, F.ITEMS_FHC_QTY)}
                            on:input={(e) => onNum(F.ITEMS_FHC_QTY, e)}
                    />
                    <input
                            label="FHC Happy"
                            value={numToInput(ui, F.ITEMS_FHC_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_FHC_HAPPY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Erotic DVD</label>
                    <input
                            label="Erotic DVD"
                            value={numToInput(ui, F.ITEMS_EDVD_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_EDVD_HAPPY, e)}
                    />
                    <input
                            label="Erotic DVD"
                            value={numToInput(ui, F.ITEMS_EDVD_QTY)}
                            on:input={(e) => onNum(F.ITEMS_EDVD_QTY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Candy Type</label>
                    <input
                            label="Candy Type"
                            value={numToInput(ui, F.ITEMS_CANDY_TYPE)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_TYPE, e)}
                    />
                    <input
                            label="Candy Happy"
                            value={numToInput(ui, F.ITEMS_CANDY_TYPE_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_TYPE_HAPPY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Poison Mistletoe</label>
                    <input
                            label="Poison Mistletoe"
                            value={numToInput(ui, F.ITEMS_POISON_MISTLETOE_QTY)}
                            on:input={(e) => onNum(F.ITEMS_POISON_MISTLETOE_QTY, e)}
                    />
                    <input
                            label="Poison Mistletoe"
                            value={numToInput(ui, F.ITEMS_POISON_MISTLETOE_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_POISON_MISTLETOE_HAPPY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Xanax</label>
                    <input
                            label="Xanax"
                            value={numToInput(ui, F.ITEMS_XANAX_QTY)}
                            on:input={(e) => onNum(F.ITEMS_XANAX_QTY, e)}
                    />
                    <input
                            label="Xanax"
                            value={numToInput(ui, F.ITEMS_XANAX_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_XANAX_HAPPY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Ecstasy</label>
                    <input
                            label="Ecstasy"
                            value={numToInput(ui, F.ITEMS_ECSTASY_QTY)}
                            on:input={(e) => onNum(F.ITEMS_ECSTASY_QTY, e)}
                    />
                    <input
                            label="Ecstasy"
                            value={numToInput(ui, F.ITEMS_ECSTASY_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_ECSTASY_HAPPY, e)}
                    />
                </div>

                <div class="inputRowOneItem">
                    <label>Total Happy</label>
                    <input
                            label="Total Happy"
                            value={numToInput(ui, F.USER_TOTAL_HAPPY)}
                            on:input={(e) => onNum(F.USER_TOTAL_HAPPY, e)}
                    />
                </div>
            </div>

            <div class="card">
                <h2>Inventory</h2>
                <div class="inputRowItem itemsHeaderRow">
                    <div class="itemsHeader">Items</div>
                    <div class="colHeader">Quantity On Hand</div>
                    <div class="colHeader">Quantity Needed</div>
                </div>

                <div class="inputRowItem">
                    <label>Feathery Hotel Coupon</label>
                    <input
                            label="Feathery Hotel Coupon"
                            value={numToInput(ui, F.USER_FHC_QTY)}
                            on:input={(e) => onNum(F.USER_FHC_QTY, e)}
                    />
                    <input
                            label="FHC Needed"
                            value={numToInput(ui, F.USER_FHC_DELTA)}
                            on:input={(e) => onNum(F.USER_FHC_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Erotic DVD</label>
                    <input
                            label="Erotic DVD On Hand"
                            value={numToInput(ui, F.USER_EDVD_QTY)}
                            on:input={(e) => onNum(F.USER_EDVD_QTY, e)}
                    />
                    <input
                            label="Erotic DVD Needed"
                            value={numToInput(ui, F.USER_EDVD_DELTA)}
                            on:input={(e) => onNum(F.USER_EDVD_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Candy Type</label>
                    <input
                            label="Candy On Hand"
                            value={numToInput(ui, F.USER_CANDY_QTY)}
                            on:input={(e) => onNum(F.USER_CANDY_QTY, e)}
                    />
                    <input
                            label="Candy Needed"
                            value={numToInput(ui, F.USER_CANDY_DELTA)}
                            on:input={(e) => onNum(F.USER_CANDY_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Poison Mistletoe</label>
                    <input
                            label="Poison Mistletoe"
                            value={numToInput(ui, F.USER_POISON_MISTLETOE_QTY)}
                            on:input={(e) => onNum(F.USER_POISON_MISTLETOE_QTY, e)}
                    />
                    <input
                            label="Poison Mistletoe"
                            value={numToInput(ui, F.USER_POISON_MISTLETOE_DELTA)}
                            on:input={(e) => onNum(F.USER_POISON_MISTLETOE_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Xanax</label>
                    <input
                            label="Xanax"
                            value={numToInput(ui, F.USER_XANAX_QTY)}
                            on:input={(e) => onNum(F.USER_XANAX_QTY, e)}
                    />
                    <input
                            label="Xanax"
                            value={numToInput(ui, F.USER_XANAX_DELTA)}
                            on:input={(e) => onNum(F.USER_XANAX_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Ecstasy</label>
                    <input
                            label="Ecstasy"
                            value={numToInput(ui, F.USER_ECSTASY_QTY)}
                            on:input={(e) => onNum(F.USER_ECSTASY_QTY, e)}
                    />
                    <input
                            label="Ecstasy"
                            value={numToInput(ui, F.USER_ECSTASY_DELTA)}
                            on:input={(e) => onNum(F.USER_ECSTASY_DELTA, e)}
                    />
                </div>
            </div>

            <div class="card">
                <h2>Market / Total</h2>
                <div class="placeholder">
                    Right: values + per-item totals + GRAND TOTAL
                </div>
            </div>
        </div>

        <!-- Row 4: Overrides (hidden in Manual) -->
        {#if ui.jumpType !== 'manual'}
            <div class="card full">
                <div class="card-header">
                    <h2>Customization</h2>
                    <button type="button" class="btn ghost">Expand</button>
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
                        <button type="button" class="btn primary">
                            {ui.jumpType === 'manual' || !ui.snapshotAtMs ? 'Calculate' : 'Recalculate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="disclaimer">Estimates only. Actual gains and costs may vary based on perks, timing, and market conditions.</div>
    </div>
</section>

<style>

    .calc-header h1 {
        margin: 6px 0 12px;
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

    .centered {
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
        border: 1px solid var(--card-border);
        background: var(--card-bg);
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

    .row3 {
        display: grid;
        grid-template-columns:
                repeat(3, 1fr);
        gap: 14px;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .subcard {
        border: 1px dashed var(--subcard-border);
        border-radius: 14px;
        padding: 12px;
    }

    .perksTwoCol {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
        row-gap: 12px;
    }

    .perksCol {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .perksSectionTitle {
        font-weight: 600;
        font-size: 0.9rem;
        opacity: 0.85;
        margin-bottom: 2px;
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
