export type RecipeType = 'candy' | 'edvd' | '99k';

export type ItemId =
    | 'candy_boxBonBons'
    | 'candy_boxChocolateBars'
    | 'candy_bagBonBons'
    | 'candy_bagChocolateKisses'
    | 'candy_boxSweetHearts'
    | 'candy_lollipop'
    | 'candy_boxExtraStrongMints'
    | 'candy_bigBoxChocolateBars'
    | 'candy_bagCandyKisses'
    | 'candy_chocolateEgg'
    | 'candy_bagBloodyEyeballs'
    | 'candy_bagTootsieRolls'
    | 'candy_bagReindeerDroppings'
    | 'candy_bagChocolateTruffles'
    | 'candy_bagSherbert'
    | 'candy_bagHumbugs'
    | 'candy_pixieSticks'
    | 'candy_jawbreaker'
    | 'candy_birthdayCupcake'
    | 'edvd'
    | 'fhc'
    | 'poison_mistletoe'
    | 'xanax'
    | 'ecstasy';

export interface ItemDef {
    id: ItemId;
    name: string;
    recipeTypes: RecipeType[];   // where it is applicable
    happy?: number;              // happy per item (if relevant)
    cooldownSeconds?: number;    // booster cooldown per item (if relevant)
}
