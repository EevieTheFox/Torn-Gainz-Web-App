import type {FieldId} from "$lib/calculator/calc_ui_state";


export const C = {

    // Item Happy and Cooldonw constants
    ITEMS_FHC_HAPPY: 'items.fhcHap',
    ITEMS_FHC_COOLDOWN: 'items.fhcCooldown',
    ITEMS_EDVD_HAPPY: 'items.eDvdHap',
    ITEMS_EDVD_COOLDOWN: 'item.eDvdCooldown',
    ITEMS_CANDY_TYPE: 'item.candyType',
    ITEMS_CANDY_TYPE_HAPPY: 'item.candyTypeHappy',
    ITEMS_CANDY_TYPE_COOLDOWN: 'item.candyTypeCooldown',
    ITEMS_POISON_MISTLETOE_HAPPY: 'items.poisonMistleHap',
    ITEMS_POISON_MISTLETOE_COOLDOWN: 'items.poisonMistleCooldown',
    ITEMS_XANAX_HAPPY: 'items.xanaxHap',
    ITEMS_XANAX_COOLDOWN: 'items.xanaxCooldown',
    ITEMS_ECSTASY_HAPPY: 'items.ecstasyHap',
    ITEMS_ECSTASY_COOLDOWN: 'items.ecstasyCooldown',

} as const satisfies Record<string, FieldId>;