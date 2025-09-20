
"use client";

const SHOPPING_LIST_STORAGE_KEY = "shoppingList";

type ShoppingListItem = {
  id: string;
  name: string;
  checked: boolean;
};

// Helper to normalize ingredient names for better duplicate detection
function normalizeIngredientName(name: string): string {
    return name.toLowerCase().replace(/s$/, '').trim();
}

export function getShoppingList(): ShoppingListItem[] {
  if (typeof window === "undefined") return [];
  const savedList = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
  return savedList ? JSON.parse(savedList) : [];
}

export function addIngredientsToShoppingList(ingredients: string[]): number {
  if (typeof window === "undefined") return 0;
  
  const existingList = getShoppingList();
  const existingNames = new Set(existingList.map(item => normalizeIngredientName(item.name)));
  let addedCount = 0;

  const newItems: ShoppingListItem[] = ingredients
    .filter(ingredient => {
      const normalizedName = normalizeIngredientName(ingredient);
      // Filter out empty strings and duplicates already in the list
      return normalizedName && !existingNames.has(normalizedName);
    })
    .map(ingredient => {
      addedCount++;
      return {
        id: `${Date.now()}-${Math.random()}`,
        name: ingredient,
        checked: false,
      };
    });

  if (newItems.length > 0) {
    const updatedList = [...existingList, ...newItems];
    localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(updatedList));
  }
  
  return addedCount;
}

export function updateShoppingListItem(itemToUpdate: ShoppingListItem): void {
  if (typeof window === "undefined") return;
  const existingList = getShoppingList();
  const updatedList = existingList.map(item =>
    item.id === itemToUpdate.id ? itemToUpdate : item
  );
  localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(updatedList));
}

export function deleteShoppingListItem(itemId: string): void {
  if (typeof window === "undefined") return;
  const existingList = getShoppingList();
  const updatedList = existingList.filter(item => item.id !== itemId);
  localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(updatedList));
}

export function clearCheckedItems(): void {
    if (typeof window === "undefined") return;
    const existingList = getShoppingList();
    const updatedList = existingList.filter(item => !item.checked);
    localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(updatedList));
}
