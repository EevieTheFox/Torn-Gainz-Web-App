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
    import { POLICY_VERSION } from "$lib/policy/policy_version";
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

<section class="page wide pageCalculator">
    <header class="pageHeader">
        <h1>Gainz Calculator</h1>

        <div class="chips">
            <span class="chips-label">Privacy</span>
            <span class="chip">{uiConsent.consentLevelLabel}</span>
            <span class="chip">{ui.hasApiKey ? 'API Key: Present' : 'API Key: Missing'}</span>
        </div>

        <div class="control-area">
            <div class="controlField row-center">
                <div class="control-row">
                    <div class="left"></div>
                    <div class="mid">
                        <div class="controlFieldLabel centered">Jump Calculation Type</div>
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
                        <label class="mini-label" for="jumps">Number of jumps</label>
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

            <div class="controlField row-center">
                {#if ui.jumpType === 'manual'}
                    <div class="control-row">
                        <div class="left"></div>
                        <div class="mid">
                            <div class="controlFieldLabel centered">Jump Style</div>
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

                        <div class="right calcMeta">
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

                        <div class="right calcMetaAuto">
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

    <!-- Cards  -->
    <div class="stack">

        <!---------- Row 1: User Information ---------->
        <div class="row3">

            <!----Row 1 Card 1 - User happy, property, property perks, and gym ----->
            <div class="card">
                <h2>Property & Gym</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="inputRowCalc">
                    <label>Property Type</label>
                    <select class="field"
                        value={numToInput(ui, F.USER_PROPERTY_TYPE)}
                        on:input={(e) => onNum(F.USER_PROPERTY_TYPE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Property Upgrades</label>
                    <select class="field"
                        value={numToInput(ui, F.USER_PROPERTY_UPGRADES)}
                        on:input={(e) => onNum(F.USER_PROPERTY_UPGRADES, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Max Natural Happy</label>
                    <input class="field field--derived" readonly
                            value={numToInput(ui, F.USER_MAX_HAPPY)}
                            on:input={(e) => onNum(F.USER_MAX_HAPPY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Gym</label>
                    <select class="field"
                            value={numToInput(ui, F.USER_GYM)}
                            on:input={(e) => onNum(F.USER_GYM, e)}
                    />
                </div>
            </div>

            <!----Row 1 Card 2 - User Stats ----->
            <div class="card">
                <h2>Current Battle Stats</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="inputRowCalc">
                    <label>Current Strength</label>
                    <input class="field"
                           value={numToInput(ui, F.USER_BATTLE_STRENGTH)}
                           on:input={(e) => onNum(F.USER_BATTLE_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Defense</label>
                    <input class="field"
                           value={numToInput(ui, F.USER_BATTLE_DEFENSE)}
                           on:input={(e) => onNum(F.USER_BATTLE_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Speed</label>
                    <input class="field"
                            value={numToInput(ui, F.USER_BATTLE_SPEED)}
                            on:input={(e) => onNum(F.USER_BATTLE_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Current Dexterity</label>
                    <input class="field"
                            value={numToInput(ui, F.USER_BATTLE_DEXTERITY)}
                            on:input={(e) => onNum(F.USER_BATTLE_DEXTERITY, e)}
                    />
                </div>
            </div>

            <!----Row 1 Card 3 - About this calculator ----->
            <div class="card">
                <h2>About This Calculator</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="placeholder">
                    Prose about the calculator
                </div>
            </div>
        </div>

        <!---------- Row 2: User Perks ---------->
        <div class="row3">

            <!-- Row 2 Card 1 - Faction perks -->
            <div class="card">
                <h2>Faction Perks</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="inputRowCalc">
                    <label>Strength Steadfast</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_STEADFAST_STRENGTH)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Defense Steadfast</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_STEADFAST_DEFENSE)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Speed Steadfast</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_STEADFAST_SPEED)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Dexterity Steadfast</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_STEADFAST_DEXTERITY)}
                            on:input={(e) => onNum(F.FACTION_STEADFAST_DEXTERITY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Cooldown Limit</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_COOLDOWN_BOOST)}
                            on:input={(e) => onNum(F.FACTION_COOLDOWN_BOOST, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Candy Happy Boost</label>
                    <select class="field"
                            value={numToInput(ui, F.FACTION_CANDY_BOOST)}
                            on:input={(e) => onNum(F.FACTION_CANDY_BOOST, e)}
                    />
                </div>
            </div>

            <!-- Row 2 Card 2 - Education perks -->
            <div class="card">
                <h2>Education Perks</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="inputRowCalc">
                    <label>Completed EDUs</label>
                    <select class="field"
                            value={numToInput(ui, F.USER_EDUCATION_STRENGTH)}
                            on:input={(e) => onNum(F.USER_EDUCATION_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Strength Boost</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_EDUCATION_STRENGTH)}
                           on:input={(e) => onNum(F.USER_EDUCATION_STRENGTH, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Defense Boost</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_EDUCATION_DEFENSE)}
                           on:input={(e) => onNum(F.USER_EDUCATION_DEFENSE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Speed Boost</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_EDUCATION_SPEED)}
                           on:input={(e) => onNum(F.USER_EDUCATION_SPEED, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Dexterity Boost</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_EDUCATION_DEXTERITY)}
                           on:input={(e) => onNum(F.USER_EDUCATION_DEXTERITY, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>All Stat Boost</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_EDUCATION_ALL)}
                           on:input={(e) => onNum(F.USER_EDUCATION_ALL, e)}
                    />
                </div>
            </div>

            <!-- Row 2 Card 3 - Job perks and Books -->
            <div class="card">
                <h2>Job Perks & Active Book</h2>
                <div class="itemsHeaderDivider"></div>

                <div class="inputRowCalc">
                    <label>Company Type</label>
                    <select class="field"
                            value={numToInput(ui, F.USER_JOB)}
                            on:input={(e) => onNum(F.USER_JOB, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Company Stars</label>
                    <select class="field"
                            value={numToInput(ui, F.USER_JOB_LEVEL)}
                            on:input={(e) => onNum(F.USER_JOB_LEVEL, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Company Perk</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_JOB_BOOST_TYPE)}
                           on:input={(e) => onNum(F.USER_JOB_BOOST_TYPE, e)}
                    />
                </div>

                <div class="inputRowCalc">
                    <label>Perk Amount</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_JOB_BOOST_LEVEL)}
                           on:input={(e) => onNum(F.USER_JOB_BOOST_LEVEL, e)}
                    />
                </div>
                <!-- REFACTOR TO BOOK SELECTION -->
                <div class="inputRowCalc">
                    <label>Active Book</label>
                    <select class="field"
                            value={numToInput(ui, F.USER_JOB_BOOST_LEVEL)}
                            on:input={(e) => onNum(F.USER_JOB_BOOST_LEVEL, e)}
                    />
                </div>
                <!-- REFACTOR TO SHOW BOOK EFFECT -->
                <div class="inputRowCalc">
                    <label>Book Effect</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_JOB_BOOST_LEVEL)}
                           on:input={(e) => onNum(F.USER_JOB_BOOST_LEVEL, e)}
                    />
                </div>
            </div>
        </div>

        <!---------- Row 3: Item Information ---------->
        <div class="row3">

            <!-- Row 3 Card 1 - Item requirements -->
            <div class="card">
                <h2>Item Requirements</h2>
                <div class="inputRowItem itemsHeaderRow">
                    <div class="itemsHeader">Item</div>
                    <div class="colHeader">Quantity Needed</div>
                    <div class="colHeader">Happy Per Item</div>
                </div>

                <div class="itemsHeaderDivider"></div>

                {#if (ui.jumpType === 'manual' && ui.manualScaffold === 'candy') || ui.jumpType === 'candy'}
                    <div class="inputRowItem">
                        <label>Candy Type</label>
                        <select class="field"
                            value={numToInput(ui, F.ITEMS_CANDY_TYPE)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_TYPE, e)}
                        />
                        <button type="button" class="btn itemRow">
                            <!-- Update function to fill fields to maximum possible, or clear for manual entry -->
                            {ui.jumpType === 'manual' || !ui.snapshotAtMs ? 'Auto-Fill' : 'Custom QTY'}
                        </button>
                    </div>

                    <div class="inputRowItem">
                        <label>Candies</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_CANDY_TYPE_QTY)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_TYPE_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.ITEMS_CANDY_TYPE_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_TYPE_HAPPY, e)}
                        />
                    </div>

                {:else if (ui.jumpType === 'manual' && (ui.manualScaffold === 'edvd' || ui.manualScaffold === '99k')) || (ui.jumpType === 'edvd' || ui.jumpType === '99k')}
                    <div class="inputRowItem">
                        <label>Erotic DVD</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_EDVD_QTY)}
                            on:input={(e) => onNum(F.ITEMS_EDVD_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                               value={numToInput(ui, F.ITEMS_EDVD_HAPPY)}
                               on:input={(e) => onNum(F.ITEMS_EDVD_HAPPY, e)}
                        />
                    </div>
                {/if}

                {#if ui.jumpType === '99k' || ui.manualScaffold === '99k'}
                    <div class="inputRowItem">
                        <label>Feathery Hotel Coupon</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_FHC_QTY)}
                            on:input={(e) => onNum(F.ITEMS_FHC_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.ITEMS_FHC_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_FHC_HAPPY, e)}
                        />
                    </div>

                    <div class="inputRowItem">
                        <label>Poison Mistletoe</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_POISON_MISTLETOE_QTY)}
                            on:input={(e) => onNum(F.ITEMS_POISON_MISTLETOE_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.ITEMS_POISON_MISTLETOE_HAPPY)}
                            on:input={(e) => onNum(F.ITEMS_POISON_MISTLETOE_HAPPY, e)}
                        />
                    </div>
                {/if}

                <div class="inputRowItem">
                    <label>Xanax</label>
                    <input class="field"
                           value={numToInput(ui, F.ITEMS_XANAX_QTY)}
                           on:input={(e) => onNum(F.ITEMS_XANAX_QTY, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.ITEMS_XANAX_HAPPY)}
                           on:input={(e) => onNum(F.ITEMS_XANAX_HAPPY, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Ecstasy</label>
                    <input class="field"
                           value={numToInput(ui, F.ITEMS_ECSTASY_QTY)}
                           on:input={(e) => onNum(F.ITEMS_ECSTASY_QTY, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.ITEMS_ECSTASY_HAPPY)}
                           on:input={(e) => onNum(F.ITEMS_ECSTASY_HAPPY, e)}
                    />
                </div>

                <div class="inputRowOneItem">
                    <label>Total Happy</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_TOTAL_HAPPY)}
                           on:input={(e) => onNum(F.USER_TOTAL_HAPPY, e)}
                    />
                </div>
            </div>

            <!-- Row 3 Card 2 - Item inventory and delta -->
            <div class="card">
                <h2>Items Owned & Needed</h2>
                <div class="inputRowItem itemsHeaderRow">
                    <div class="itemsHeader">Items</div>
                    <div class="colHeader">Quantity Owned</div>
                    <div class="colHeader">Quantity Needed</div>
                </div>

                <div class="itemsHeaderDivider"></div>

                {#if (ui.jumpType === 'manual' && ui.manualScaffold === 'candy') || ui.jumpType === 'candy'}
                    <div class="inputRowItem">
                        <label>Candy</label>
                        <input class="field"
                            value={numToInput(ui, F.USER_CANDY_QTY)}
                            on:input={(e) => onNum(F.USER_CANDY_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.USER_CANDY_DELTA)}
                            on:input={(e) => onNum(F.USER_CANDY_DELTA, e)}
                        />
                    </div>

                {:else if (ui.jumpType === 'manual' && (ui.manualScaffold === 'edvd' || ui.manualScaffold === '99k')) || (ui.jumpType === 'edvd' || ui.jumpType === '99k')}
                    <div class="inputRowItem">
                        <label>Erotic DVD</label>
                        <input class="field"
                               value={numToInput(ui, F.USER_EDVD_QTY)}
                               on:input={(e) => onNum(F.USER_EDVD_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                               value={numToInput(ui, F.USER_EDVD_DELTA)}
                               on:input={(e) => onNum(F.USER_EDVD_DELTA, e)}
                        />
                    </div>
                {/if}

                {#if ui.jumpType === '99k' || ui.manualScaffold === '99k'}
                    <div class="inputRowItem">
                        <label>Feathery Hotel Coupon</label>
                        <input class="field"
                               value={numToInput(ui, F.USER_FHC_QTY)}
                               on:input={(e) => onNum(F.USER_FHC_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                               value={numToInput(ui, F.USER_FHC_DELTA)}
                               on:input={(e) => onNum(F.USER_FHC_DELTA, e)}
                        />
                    </div>

                    <div class="inputRowItem">
                        <label>Poison Mistletoe</label>
                        <input class="field"
                            value={numToInput(ui, F.USER_POISON_MISTLETOE_QTY)}
                            on:input={(e) => onNum(F.USER_POISON_MISTLETOE_QTY, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.USER_POISON_MISTLETOE_DELTA)}
                            on:input={(e) => onNum(F.USER_POISON_MISTLETOE_DELTA, e)}
                        />
                    </div>
                {/if}

                <div class="inputRowItem">
                    <label>Xanax</label>
                    <input class="field"
                           value={numToInput(ui, F.USER_XANAX_QTY)}
                           on:input={(e) => onNum(F.USER_XANAX_QTY, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_XANAX_DELTA)}
                           on:input={(e) => onNum(F.USER_XANAX_DELTA, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Ecstasy</label>
                    <input class="field"
                           value={numToInput(ui, F.USER_ECSTASY_QTY)}
                           on:input={(e) => onNum(F.USER_ECSTASY_QTY, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_ECSTASY_DELTA)}
                           on:input={(e) => onNum(F.USER_ECSTASY_DELTA, e)}
                    />
                </div>
            </div>

            <!-- Row 3 Card 3 - Item costs -->
            <div class="card">
                <h2>Market Prices & Total Cost</h2>
                <div class="inputRowItem itemsHeaderRow">
                    <div class="itemsHeader">Items</div>
                    <div class="colHeader">Market Price</div>
                    <div class="colHeader">Net Cost</div>
                </div>

                <div class="itemsHeaderDivider"></div>

                {#if (ui.jumpType === 'manual' && ui.manualScaffold === 'candy') || ui.jumpType === 'candy'}
                    <div class="inputRowItem">
                        <label>Candy</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_CANDY_PRICE)}
                            on:input={(e) => onNum(F.ITEMS_CANDY_PRICE, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.USER_CANDY_COST)}
                            on:input={(e) => onNum(F.USER_CANDY_COST, e)}
                        />
                    </div>

                {:else if (ui.jumpType === 'manual' && (ui.manualScaffold === 'edvd' || ui.manualScaffold === '99k')) || (ui.jumpType === 'edvd' || ui.jumpType === '99k')}
                    <div class="inputRowItem">
                        <label>Erotic DVD</label>
                        <input class="field"
                               value={numToInput(ui, F.ITEMS_EDVD_PRICE)}
                               on:input={(e) => onNum(F.ITEMS_EDVD_PRICE, e)}
                        />
                        <input class="field field--derived" readonly
                               value={numToInput(ui, F.USER_EDVD_COST)}
                               on:input={(e) => onNum(F.USER_EDVD_COST, e)}
                        />
                    </div>
                {/if}

                {#if ui.jumpType === '99k' || ui.manualScaffold === '99k'}
                    <div class="inputRowItem">
                        <label>Feathery Hotel Coupon</label>
                        <input class="field"
                               value={numToInput(ui, F.ITEMS_FHC_PRICE)}
                               on:input={(e) => onNum(F.ITEMS_FHC_PRICE, e)}
                        />
                        <input class="field field--derived" readonly

                               value={numToInput(ui, F.USER_FHC_COST)}
                               on:input={(e) => onNum(F.USER_FHC_COST, e)}
                        />
                    </div>

                    <div class="inputRowItem">
                        <label>Poison Mistletoe</label>
                        <input class="field"
                            value={numToInput(ui, F.ITEMS_POISON_MISTLETOE_PRICE)}
                            on:input={(e) => onNum(F.ITEMS_POISON_MISTLETOE_PRICE, e)}
                        />
                        <input class="field field--derived" readonly
                            value={numToInput(ui, F.USER_POISON_MISTLETOE_COST)}
                            on:input={(e) => onNum(F.USER_POISON_MISTLETOE_COST, e)}
                        />
                    </div>
                {/if}

                <div class="inputRowItem">
                    <label>Xanax</label>
                    <input class="field"
                           value={numToInput(ui, F.ITEMS_XANAX_PRICE)}
                           on:input={(e) => onNum(F.ITEMS_XANAX_PRICE, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_XANAX_COST)}
                           on:input={(e) => onNum(F.USER_XANAX_COST, e)}
                    />
                </div>

                <div class="inputRowItem">
                    <label>Ecstasy</label>
                    <input class="field"
                           value={numToInput(ui, F.ITEMS_ECSTASY_PRICE)}
                           on:input={(e) => onNum(F.ITEMS_ECSTASY_PRICE, e)}
                    />
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_ECSTASY_COST)}
                           on:input={(e) => onNum(F.USER_ECSTASY_COST, e)}
                    />
                </div>

                <div class="inputRowOneItem">
                    <label>Grand Total</label>
                    <input class="field field--derived" readonly
                           value={numToInput(ui, F.USER_ITEMS_TOTAL_COST)}
                           on:input={(e) => onNum(F.USER_ITEMS_TOTAL_COST, e)}
                    />
                </div>
            </div>
        </div>

        <!---------- Bottom Row: Results ---------->
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
                            {ui.jumpType === 'manual' || !ui.snapshotAtMs ? 'Set Max' : 'Recalculate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="disclaimer">Estimates only. Actual gains and costs may vary based on perks, timing, and market conditions.</div>
    </div>
</section>

<!-- styles moved to src/routes/layout.css -->
