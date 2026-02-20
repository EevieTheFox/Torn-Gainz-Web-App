import type { CalcUIState, FieldId } from './calc_ui_state';

// ui fields
export const F = {
    // Row 1 left card
    USER_MAX_HAPPY: 'user.maxHappy',
    USER_PROPERTY_TYPE: 'user.propertyType',
    USER_PROPERTY_PERKS: 'user.propertyPerks',

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
