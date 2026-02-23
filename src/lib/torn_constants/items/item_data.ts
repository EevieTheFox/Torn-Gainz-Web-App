import type { ItemDef } from './item.types';

export const ITEMS: readonly ItemDef[] = [
    { id: 'candy_boxBonBons', name: 'Box of Bon Bons', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_boxChocolateBars', name: 'Box of Chocolate Bars', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_bagBonBons', name: 'Bag of Bon Bons', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_boxChocolateKisses', name: 'Bag of Chocolate Kisses', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_boxSweetHearts', name: 'Box of Sweet Hearts', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_lollipop', name: 'Lollipop', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_boxExtraStrongMints', name: 'Box of Extra Strong Mints', recipeTypes: ['candy'], happy: 25, cooldownSeconds: 1800},
    { id: 'candy_bigBoxChocolateBars', name: 'Big Box of Chocolate Bars', recipeTypes: ['candy'], happy: 35, cooldownSeconds: 1800},
    { id: 'candy_bagCandyKises', name: 'Bag of Candy Kisses', recipeTypes: ['candy'], happy: 50, cooldownSeconds: 1800},
    { id: 'candy_chocolateEgg', name: 'Chocolate Egg', recipeTypes: ['candy'], happy: 50, cooldownSeconds: 1800},
    { id: 'candy_bagBloodyEyeballs', name: 'Bag of Bloody Eyeballs', recipeTypes: ['candy'], happy: 75, cooldownSeconds: 1800},
    { id: 'candy_bagTootsieRolls', name: 'Bag of Tootsie Rolls', recipeTypes: ['candy'], happy: 75, cooldownSeconds: 1800},
    { id: 'candy_bagReindeerDroppings', name: 'Bag of Reindeer Droppings', recipeTypes: ['candy'], happy: 100, cooldownSeconds: 1800},
    { id: 'candy_bagChocolateTruffles', name: 'Bag of Chocolate Truffles', recipeTypes: ['candy'], happy: 100, cooldownSeconds: 1800},
    { id: 'candy_bagSherbert', name: 'Bag of Sherbert', recipeTypes: ['candy'], happy: 150, cooldownSeconds: 1800},
    { id: 'candy_bagOfHumbugs', name: 'Bag of Humbugs', recipeTypes: ['candy'], happy: 150, cooldownSeconds: 1800},
    { id: 'candy_pixieSticks', name: 'Pixie Sticks', recipeTypes: ['candy'], happy: 150, cooldownSeconds: 1800},
    { id: 'candy_jawbreaker', name: 'Jawbreaker', recipeTypes: ['candy'], happy: 150, cooldownSeconds: 1800},
    { id: 'candy_birthdayCupcake', name: 'Birthday Cupcake', recipeTypes: ['candy'], happy: 250, cooldownSeconds: 1800},
    { id: 'edvd', name: 'Erotic DVD', recipeTypes: ['edvd','99k'], happy: 2500, cooldownSeconds: 21600 },
    { id: 'fhc', name: 'Feathery Hotel Coupon', recipeTypes: ['99k'], happy: 0, cooldownSeconds: 21600 },
    { id: 'poison_mistletoe', name: 'Poison Mistletoe', recipeTypes: ['99k'], happy: 21875, cooldownSeconds: 0 },
    { id: 'xanax', name: 'Xanax', recipeTypes: ['candy', 'edvd', '99k'], happy: 0, cooldownSeconds: 28800 },
    { id: 'ecstasy', name: 'Ecstasy', recipeTypes: ['candy', 'edvd', '99k'], happy: 0, cooldownSeconds: 0 }

] as const;
