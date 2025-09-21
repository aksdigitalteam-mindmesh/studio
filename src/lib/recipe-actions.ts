

"use client";

import type { Meal, Recipe } from "@/lib/types";

const RECIPES_STORAGE_KEY = "savedRecipes";

function slugify(text: string) {
  const randomString = Math.random().toString(36).substring(2, 7);
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + randomString;
}

export function getSavedRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  const savedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
  return savedRecipes ? JSON.parse(savedRecipes) : [];
}

export function saveRecipesFromPlan(meals: Meal[]): Recipe[] {
  if (typeof window === "undefined") return [];
  const existingRecipes = getSavedRecipes();
  const newRecipes: Recipe[] = meals.map(meal => ({
      slug: slugify(meal.name),
      title: meal.name,
      category: meal.name,
      description: meal.description,
      ingredients: meal.recipe.ingredients,
      instructions: meal.recipe.instructions,
      calories: meal.calories,
      macros: meal.macros,
  }));

  // Avoid duplicates - simple check based on title. This is a bit naive if names are not unique from AI.
  // A better check might involve deep comparison of ingredients/instructions if needed.
  const recipesToSave = newRecipes.filter(
    newRecipe => !existingRecipes.some(existing => existing.title === newRecipe.title && JSON.stringify(existing.ingredients) === JSON.stringify(newRecipe.ingredients))
  );

  if(recipesToSave.length > 0){
    const updatedRecipes = [...existingRecipes, ...recipesToSave];
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
  }
  return recipesToSave;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
    const recipes = getSavedRecipes();
    const discoverableRecipes = getDiscoverableRecipes();
    return [...recipes, ...discoverableRecipes].find(recipe => recipe.slug === slug);
}

export function getDiscoverableRecipes(): Recipe[] {
    return [
        {
            slug: "avocado-toast",
            title: "Avocado Toast",
            category: "Breakfast",
            image: "https://placehold.co/600x400.png",
            hint: "avocado toast",
            description: "A quick and delicious breakfast classic.",
            ingredients: ["2 slices of bread", "1 ripe avocado", "Salt, pepper, and red pepper flakes to taste"],
            instructions: ["Toast the bread to your liking.", "Mash the avocado and spread it on the toast.", "Season with salt, pepper, and red pepper flakes."],
            calories: 300,
            macros: { protein: '10g', carbs: '30g', fat: '18g' }
        },
        {
            slug: "chicken-salad",
            title: "Chicken Salad",
            category: "Lunch",
            image: "https://placehold.co/600x400.png",
            hint: "chicken salad",
            description: "A light and protein-packed lunch option.",
            ingredients: ["1 cup cooked chicken, shredded", "1/4 cup greek yogurt", "1 tbsp lemon juice", "Celery and onions, diced"],
            instructions: ["Mix all ingredients in a bowl.", "Serve on bread, lettuce, or with crackers."],
            calories: 400,
            macros: { protein: '40g', carbs: '10g', fat: '20g' }
        },
        {
            slug: "salmon-and-veggies",
            title: "Salmon and Veggies",
            category: "Main Course",
            image: "https://placehold.co/600x400.png",
            hint: "salmon vegetables",
            description: "A healthy and satisfying dinner, rich in omega-3s.",
            ingredients: ["1 salmon fillet", "1 cup mixed vegetables (broccoli, bell peppers)", "1 tbsp olive oil"],
            instructions: ["Toss veggies in olive oil and roast at 400°F (200°C) for 15 mins.", "Add salmon and roast for another 10-12 minutes."],
            calories: 550,
            macros: { protein: '45g', carbs: '15g', fat: '35g' }
        },
        {
            slug: "protein-smoothie",
            title: "Protein Smoothie",
            category: "Snack",
            image: "https://placehold.co/600x400.png",
            hint: "protein smoothie",
            description: "The perfect post-workout refuel.",
            ingredients: ["1 scoop protein powder", "1 banana", "1 cup almond milk", "1 tbsp peanut butter"],
            instructions: ["Blend all ingredients until smooth."],
            calories: 350,
            macros: { protein: '30g', carbs: '35g', fat: '12g' }
        },
    ];
}
