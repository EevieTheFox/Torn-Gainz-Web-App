// calc_ui_state.ts
// UI-only state + transition logic for the Calculator page.
// Goal: deterministic UX transitions + future-proof hooks for autofill/scaffolds
// without clobbering user edits.

export type JumpType = 'manual' | 'candy' | 'edvd' | '99k';
export type InputMode = 'auto' | 'manual';
export type ManualScaffold = 'candy' | 'edvd' | '99k';

export type FieldId = string;
export type FieldPatch = Record<FieldId, unknown>;

export type CalcUIState = {
    jumpType: JumpType;

    // contextual row-2 state
    inputMode: InputMode;           // used when jumpType != 'manual'
    manualScaffold: ManualScaffold; // used when jumpType == 'manual'

    jumpsCount: number;

    // placeholder until we implement real API key storage
    hasApiKey: boolean;

    // timestamp for batched pulls (stats/perks/prices) - store as ms for easy persistence
    snapshotAtMs: number | null;

    // future async support (even if stubbed today)
    isSnapshotLoading: boolean;
    snapshotError: string | null;

    // field touch tracking to avoid clobbering edits when scaffold/autofill runs
    touched: Set<FieldId>;

    // UI field bag (inputs + autofilled values live here)
    fields: Record<FieldId, unknown>;

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

        snapshotAtMs: null,
        isSnapshotLoading: false,
        snapshotError: null,

        touched: new Set(),
        fields: {},

        lastNotice: null
    };
}

/* -------------------------
   Transition helpers
-------------------------- */

/**
 * Update API-key presence and enforce UX defaults.
 * - If on a recipe mode: default to Auto when key appears, Manual when it disappears.
 * - If currently in Auto and key disappears: force Manual and clear snapshot.
 */
export function setHasApiKey(state: CalcUIState, hasApiKey: boolean): CalcUIState {
    let s = clone(state);
    s.lastNotice = null;

    const prev = s.hasApiKey;
    s.hasApiKey = hasApiKey;

    // No change? do nothing.
    if (prev === hasApiKey) return s;

    // Manual jump type doesn't use auto pulls; keep things consistent.
    if (s.jumpType === 'manual') {
        s = clearSnapshot(s);
        return s;
    }

    // Recipe modes: enforce inputMode defaults
    if (!hasApiKey) {
        // Auto no longer possible
        if (s.inputMode === 'auto') {
            s.lastNotice = 'API key removed; switched to Manual mode.';
        }
        s.inputMode = 'manual';
        s = clearSnapshot(s);
        return s;
    }

    // hasApiKey just became true
    // Snap to Auto by default (Outcome-first users expect it)
    s.inputMode = 'auto';
    s = runAutoBatchPullStub(s);
    return s;
}

/**
 * Row 1 selection: Jump Calculation Type
 */
export function selectJumpType(state: CalcUIState, next: JumpType): CalcUIState {
    let s = clone(state);
    s.lastNotice = null;
    const prior = state.jumpType;

    s.jumpType = next;

    if (next === 'manual') {
        // Manual = control-first. Row 2 becomes scaffold selector.
        // If they came from a recipe, mirror it into scaffold for continuity
        if (prior !== 'manual') {
            s.manualScaffold = prior; // candy/edvd/99k are valid scaffolds
        }

        // Apply scaffold autopopulation (non-clobber), stubbed.
        s = applyManualScaffoldStub(s, s.manualScaffold);

        // Snapshot is not authoritative in manual mode (but we keep it if you later decide otherwise).
        // Today, we clear it for clarity.
        s = clearSnapshot(s);
        return s;
    }

    // Non-manual => Row 2 is Input Mode selector (Auto/Manual)
    // Default inputMode based on api presence
    s.inputMode = s.hasApiKey ? 'auto' : 'manual';

    if (s.inputMode === 'auto') {
        s = runAutoBatchPullStub(s);
    } else {
        s = clearSnapshot(s);
    }

    return s;
}

/**
 * Row 2 selection when Row 1 = manual: scaffold selector
 */
export function selectManualScaffold(state: CalcUIState, next: ManualScaffold): CalcUIState {
    let s = clone(state);
    s.lastNotice = null;
    s.manualScaffold = next;

    s = applyManualScaffoldStub(s, next);
    // Manual scaffold implies no authoritative snapshot
    s = clearSnapshot(s);
    return s;
}

/**
 * Row 2 selection when Row 1 != manual: input mode selector
 */
export function selectInputMode(state: CalcUIState, next: InputMode): CalcUIState {
    let s = clone(state);
    s.lastNotice = null;

    if (next === 'auto' && !s.hasApiKey) {
        s.inputMode = 'manual';
        s = clearSnapshot(s);
        s.lastNotice = 'Auto mode requires an API key.';
        return s;
    }

    s.inputMode = next;

    if (next === 'auto') {
        s = runAutoBatchPullStub(s);
    } else {
        s = clearSnapshot(s);
    }

    return s;
}

export function setJumpsCount(state: CalcUIState, next: number): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.jumpsCount = Math.max(1, Math.floor(next || 1));
    return s;
}

/* -------------------------
   Field setting (touched-aware)
-------------------------- */

/**
 * Hard-set a UI field and mark it as touched (user edited).
 * Use stable ids like 'user.maxHappy', 'items.edvd.count', etc.
 */
export function setField<T>(state: CalcUIState, fieldId: FieldId, value: T): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.fields[fieldId] = value as unknown;
    s.touched.add(fieldId);
    return s;
}

/**
 * Soft-set a UI field ONLY if the user has not touched it.
 * Used by scaffolds and autofill.
 */
export function setFieldSoft<T>(state: CalcUIState, fieldId: FieldId, value: T): CalcUIState {
    if (state.touched.has(fieldId)) return state;
    const s = clone(state);
    s.fields[fieldId] = value as unknown;
    return s;
}

/**
 * Apply a soft patch of many fields, respecting touched.
 */
export function applySoftPatch(state: CalcUIState, patch: FieldPatch): CalcUIState {
    let s = state;
    for (const [k, v] of Object.entries(patch)) {
        s = setFieldSoft(s, k, v);
    }
    return s;
}

/**
 * Mark a field as touched without changing its value.
 * Useful if some interaction should lock a field.
 */
export function touch(state: CalcUIState, fieldId: FieldId): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.touched.add(fieldId);
    return s;
}

/**
 * Optional utility: clear touched state for a specific field
 * (handy for "Reset to Auto" buttons later).
 */
export function untouch(state: CalcUIState, fieldId: FieldId): CalcUIState {
    const s = clone(state);
    s.lastNotice = null;
    s.touched.delete(fieldId);
    return s;
}

/* -------------------------
   Snapshot helpers
-------------------------- */

function clearSnapshot(state: CalcUIState): CalcUIState {
    const s = clone(state);
    s.snapshotAtMs = null;
    s.isSnapshotLoading = false;
    s.snapshotError = null;
    return s;
}

/* -------------------------
   Stubs (placeholders)
   Replace these once you define real data + API model.
-------------------------- */

// Example scaffold defaults. Replace with real field ids/values.
const scaffoldDefaults: Record<ManualScaffold, FieldPatch> = {
    candy: {
        // 'items.candy.count': 0,
        // 'items.candy.avgPrice': null,
        // 'user.maxHappy': null,
    },
    edvd: {
        // 'items.edvd.count': 0,
        // 'items.edvd.avgPrice': null,
        // 'user.maxHappy': null,
    },
    '99k': {
        // 'items.99k.count': 0,
        // 'items.99k.avgPrice': null,
        // 'user.maxHappy': null,
    }
};

function applyManualScaffoldStub(state: CalcUIState, scaffold: ManualScaffold): CalcUIState {
    // Populate requirements unless user touched those fields.
    // Replace with real field writes once your data model is defined.
    const patch = scaffoldDefaults[scaffold] ?? {};
    let s = applySoftPatch(state, patch);

    // Manual scaffolding => snapshot not authoritative
    s = clearSnapshot(s);

    return s;
}

function runAutoBatchPullStub(state: CalcUIState): CalcUIState {
    // Placeholder for stats/perks/prices API calls. We only need UI behavior now.
    // Later this becomes:
    // - set loading true, clear error
    // - async fetch (stats/perks/prices in batch)
    // - applySoftPatch(...) for derived fields
    // - set snapshotAtMs when complete
    let s = clone(state);
    s.isSnapshotLoading = false;
    s.snapshotError = null;
    s.snapshotAtMs = Date.now();
    return s;
}

/* -------------------------
   Clone
-------------------------- */

function clone(state: CalcUIState): CalcUIState {
    return {
        ...state,
        touched: new Set(state.touched),
        fields: { ...state.fields }
    };
}
