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

    // Row 1 right card - prose about this calculator

    // Row 2 left card
    FACTION_STEADFAST_STRENGTH: 'faction.sfStr',
    FACTION_STEADFAST_DEFENSE: 'faction.sfDef',
    FACTION_STEADFAST_SPEED: 'faction.sfSpd',
    FACTION_STEADFAST_DEXTERITY: 'faction.sfDex',
    FACTION_COOLDOWN_BOOST: 'faction.coolDownBoost',
    FACTION_CANDY_BOOST: 'faction.candyBoost',

    // Row 2 middle card
    USER_EDUCATION_STRENGTH: 'user.eduStr',
    USER_EDUCATION_DEFENSE: 'user.eduDef',
    USER_EDUCATION_SPEED: 'user.eduSpd',
    USER_EDUCATION_DEXTERITY: 'user.eduDex',
    USER_EDUCATION_ALL: 'user.eduAll',

    // Row 2 right card
    USER_JOB: 'user.job', // Company type
    USER_JOB_LEVEL: 'user.jobLevel', // Company stars
    USER_JOB_BOOST_TYPE: 'user.jobBoostType',
    USER_JOB_BOOST_LEVEL: 'user.jobBoostLevel',

    // Row 3 left card
    ITEMS_FHC_QTY: 'items.fhcQty',
    ITEMS_FHC_HAPPY: 'items.fhcHap',
    ITEMS_FHC_COOLDOWN: 'items.fhcCooldown',
    ITEMS_EDVD_QTY: 'items.eDvdQty',
    ITEMS_EDVD_HAPPY: 'items.eDvdHap',
    ITEMS_EDVD_COOLDOWN: 'item.eDvdCooldown',
    ITEMS_CANDY_TYPE: 'item.candyType',
    ITEMS_CANDY_TYPE_QTY: 'items.candyTypeQty',
    ITEMS_CANDY_TYPE_HAPPY: 'item.candyTypeHappy',
    ITEMS_CANDY_TYPE_COOLDOWN: 'item.candyTypeCooldown',
    ITEMS_POISON_MISTLETOE_QTY: 'items.poisonMistleQty',
    ITEMS_POISON_MISTLE_HAPPY: 'items.poisonMistleHap',
    ITEMS_POISON_MISTLETOE_COOLDOWN: 'items.poisonMistleCooldown',
    ITEMS_XANAX_QTY: 'items.xanaxQty',
    ITEMS_XANAX_HAPPY: 'items.xanaxHap',
    ITEMS_XANAX_COOLDOWN: 'items.xanaxCooldown',
    ITEMS_ECSTASY_QTY: 'items.ecstasyQTY',
    ITEMS_ECSTASY_HAPPY: 'items.ecstasyHap',
    ITEMS_ECSTASY_COOLDOWN: 'items.ecstasyCooldown',
    USER_TOTAL_HAPPY: 'user.totalHap',

    // Row 3 middle card
    USER_FHC_QTY: 'user.fhcQty',
    USER_FHC_DELTA: 'user.fhcDelta',
    USER_EDVD_QTY: 'user.fhcQty',
    USER_EDVD_DELTA: 'user.eDvdDelta',
    USER_CANDY_QTY: 'user.candyQty',
    USER_CANDY_DELTA: 'user.candyDelta',
    USER_POISON_MISTLETOE_QTY: 'user.poisonMistleQty',
    USER_POISON_MISTLETOE_DELTA: 'user.poisonMistleDelta',
    USER_XANAX_QTY: 'user.xanaxQty',
    USER_XANAX_DELTA: 'user.xanaxDelta',
    USER_ECSTASY_QTY: 'user.ecstasyQty',
    USER_ECSTASY_DELTA: 'user.ecstasyDelta',

    //Row 3 right card
    ITEMS_FHC_PRICE: 'items.fhcPrice',
    USER_FHC_COST: 'user.fhcCost',
    ITEMS_EDVD_PRICE: 'items.eDvdPrice',
    USER_EDVD_COST: 'user.eDvdCost',
    ITEMS_CANDY_PRICE: 'items.candyPrice',
    USER_CANDY_COST: 'user.candyCost',
    ITEMS_POISON_MISTLETOE_PRICE: 'items.poisonMistlePrice',
    USER_POISON_MISTLETOE_COST: 'user.poisonMistleCost',
    ITEMS_XANAX_PRICE: 'items.xanaxPRICE',
    USER_XANAX_COST: 'user.xanaxCost',
    ITEMS_ECSTASY_PRICE: 'items.ecstasyPrice',
    USER_ECSTASY_COST: 'user.ecstasyCost',
    USER_ITEMS_TOTAL_COST: 'user.itemsTotalCost',

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
