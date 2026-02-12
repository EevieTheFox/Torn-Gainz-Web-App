export type JumpType = 'manual' | 'candy' | 'edvd' | '99k';
export type InputMode = 'auto' | 'manual';
export type ManualScaffold = 'candy' | 'edvd' | '99k';

export type CalcUIState = {
    jumpType: JumpType;

    // contextual row-2 state
    inputMode: InputMode;           // used when jumpType != 'manual'
    manualScaffold: ManualScaffold; // used when jumpType == 'manual'

    jumpsCount: number;

    // placeholder until we implement real API key storage
    hasApiKey: boolean;

    // timestamp for batched pulls (stats/perks/prices)
    snapshotAt: Date | null;

    // field touch tracking to avoid clobbering edits when scaffold changes
    touched: Set<string>;

    // for UI messaging (toast/banner later)
    lastNotice: string | null;
};

export function createInitialState(opts?: Partial<Pick<CalcUIState, 'hasApiKey'>>): CalcUIState {
    const hasApiKey = opts?.hasApiKey ?? false;

    return {
        jumpType: hasApiKey ? 'candy' : 'manual',
        inputMode: hasApiKey ? 'auto' : 'manual',
        manualScaffold: 'candy',
        jumpsCount: 1,
        hasApiKey,
        snapshotAt: null,
        touched: new Set(),
        lastNotice: null
    };
}

/**
 * Update API-key presence and enforce UX defaults.
 * - If on a recipe mode: default to Auto when key appears, Manual when it disappears.
 * - If currently in Auto and key disappears: force Manual and clear snapshot.
 */
export function setHasApiKey(state: CalcUIState, hasApiKey: boolean): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;

    const prev = s.hasApiKey;
    s.hasApiKey = hasApiKey;

    // No change? do nothing.
    if (prev === hasApiKey) return s;

    // Manual jump type doesn't use auto pulls; just keep things consistent.
    if (s.jumpType === 'manual') {
        s.snapshotAt = null;
        return s;
    }

    // Recipe modes: enforce inputMode defaults
    if (!hasApiKey) {
        // Auto no longer possible
        if (s.inputMode === 'auto') {
            s.lastNotice = 'API key removed; switched to Manual mode.';
        }
        s.inputMode = 'manual';
        s.snapshotAt = null;
        return s;
    }

    // hasApiKey just became true
    // Snap to Auto by default (Outcome-first users expect it)
    s.inputMode = 'auto';
    runAutoBatchPullStub(s);
    return s;
}

/**
 * Row 1 selection: Jump Calculation Type
 */
export function selectJumpType(state: CalcUIState, next: JumpType): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.jumpType = next;

    if (next === 'manual') {

        // Manual = control-first. Row 2 becomes scaffold selector.
        // If they came from a recipe, mirror it into scaffold for continuity
        const prior = state.jumpType;
        if (prior !== 'manual') {
            s.manualScaffold = prior; // candy/edvd/99k are valid scaffolds
        }

        // Apply scaffold autopopulation (non-clobber), stubbed.
        applyManualScaffoldStub(s, s.manualScaffold);
        // snapshot irrelevant for manual; keep it, or clear it—your call.
        // I'd keep it if it came from earlier, but you can clear:
        // s.snapshotAt = null;

        return s;
    }

    // Non-manual => Row 2 is Input Mode selector (Auto/Manual)
    // Default inputMode based on api presence
    s.inputMode = s.hasApiKey ? 'auto' : 'manual';

    // If we defaulted to auto, refresh snapshot (stub)
    if (s.inputMode === 'auto') {
        runAutoBatchPullStub(s);
    } else {
        // If manual, snapshot is not authoritative; clear it
        s.snapshotAt = null;
    }

    return s;
}

/**
 * Row 2 selection when Row 1 = manual: scaffold selector
 */
export function selectManualScaffold(state: CalcUIState, next: ManualScaffold): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.manualScaffold = next;

    applyManualScaffoldStub(s, next);
    return s;
}

/**
 * Row 2 selection when Row 1 != manual: input mode selector
 */
export function selectInputMode(state: CalcUIState, next: InputMode): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;

    if (next === 'auto' && !s.hasApiKey) {
        s.inputMode = 'manual';
        s.snapshotAt = null;
        s.lastNotice = 'Auto mode requires an API key.';
        return s;
    }

    s.inputMode = next;

    if (next === 'auto') {
        runAutoBatchPullStub(s);
    } else {
        s.snapshotAt = null;
    }

    return s;
}


export function setJumpsCount(state: CalcUIState, next: number): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.jumpsCount = Math.max(1, Math.floor(next || 1));
    return s;
}

/**
 * Mark a specific field as "touched" by the user to prevent scaffolds overwriting it.
 * Use stable ids like 'user.maxHappy', 'items.edvd.count', etc.
 */
export function touch(state: CalcUIState, fieldId: string): CalcUIState {
    const s = clone(state);
    s.touched.add(fieldId);
    return s;
}

/* -------------------------
   Stubs (placeholders)
-------------------------- */

function applyManualScaffoldStub(state: CalcUIState, scaffold: ManualScaffold) {
    // Example: populate requirements unless user touched those fields.
    // Replace with real field writes once you define your data model.

    // PSEUDO:
    // if (!state.touched.has('items.requirements')) state.items.requirements = scaffoldDefaults[scaffold]
    // if (!state.touched.has('user.maxHappy')) state.user.maxHappy = default...

    // For now, just clear snapshot since this is manual scaffolding (optional)
    state.snapshotAt = null;
}

function runAutoBatchPullStub(state: CalcUIState) {
    // Placeholder for stats/perks/prices API calls. We only need UI behavior now.
    state.snapshotAt = new Date();
}

function clone(state: CalcUIState): CalcUIState {
    return {
        ...state,
        touched: new Set(state.touched)
    };
}
