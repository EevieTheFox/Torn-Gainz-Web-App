import type { CalcUIState, FieldId } from './calc_ui_state';

// ui fields
export const F = {
    // Row 1 left card
    USER_MAX_HAPPY: 'user.maxHappy',
    USER_PROPERTY_TYPE: 'user.propertyType',
    USER_PROPERTY_UPGRADES: 'user.propertyUpgrades',
    USER_GYM: 'user.gym',

    // Row 1 middle card
    USER_BATTLE_STRENGTH: 'user.batStr',
    USER_BATTLE_DEFENSE: 'user.batDef',
    USER_BATTLE_SPEED: 'user.batSpd',
    USER_BATTLE_DEXTERITY: 'user.batDex',

    // Row 1 right card
    // Faction boosts
    FACTION_STEADFAST_STRENGTH: 'user.facSfStr',
    FACTION_STEADFAST_DEFENSE: 'user.facSfDef',
    FACTION_STEADFAST_SPEED: 'user.facSfSpd',
    FACTION_STEADFAST_DEXTERITY: 'user.facSfDex',
    FACTION_COOLDOWN_BOOST: 'user.facCdBoost',
    FACTION_CANDY_BOOST: 'user.facCandyBoost',
    // Education boosts
    USER_EDUCATION_STRENGTH: 'user.eduStr',
    USER_EDUCATION_DEFENSE: 'user.eduDef',
    USER_EDUCATION_SPEED: 'user.eduSpd',
    USER_EDUCATION_DEXTERITY: 'user.eduDex',
    USER_EDUCATION_ALL: 'user.eduAll',
    // Job perks
    USER_JOB: 'user.job', // Company type
    USER_JOB_LEVEL: 'user.jobLevel', // Company stars
    USER_JOB_BOOST_TYPE: 'user.jobBoostType',
    USER_JOB_BOOST_LEVEL: 'user.jobBoostLevel',

    // Row 2 left card
    ITEMS_CANDY_TYPE: 'item.candyType',
    ITEMS_CANDY_QTY: 'items.candy.qty',
    ITEMS_CANDY_PRICE: 'items.candy.price',
} as const satisfies Record<string, FieldId>;

// gets a number value from appropriate fields
export function getNum(ui: CalcUIState, id: FieldId): number | null {
    const v = ui.fields[id];
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

// gets a string value from appropriate fields
export function getStr(ui: CalcUIState, id: FieldId): string {
    const v = ui.fields[id];
    return typeof v === 'string' ? v : '';
}

// For inputs: keep empty when null
export function numToInput(ui: CalcUIState, id: FieldId): string {
    const n = getNum(ui, id);
    return n === null ? '' : String(n);
}
