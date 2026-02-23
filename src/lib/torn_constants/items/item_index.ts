import { ITEMS } from './item.data';
import type { RecipeType, ItemId } from './item.types';

export const itemById = new Map(
    ITEMS.map(i => [i.id, i])
);

export function itemsForRecipe(recipe: RecipeType) {
    return ITEMS.filter(i => i.recipeTypes.includes(recipe));
}
