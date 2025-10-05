
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getRecipeBySlug } from "@/lib/recipe-actions";
import type { Recipe } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Apple, Dot, Bookmark, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveRecipesFromPlan } from "@/lib/recipe-actions";
import { addIngredientsToShoppingList } from "@/lib/shopping-list-actions";

export default function RecipeDetailsPage({ params }: { params: { slug: string } }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const slug = params.slug;

  useEffect(() => {
    setIsClient(true);
    setRecipe(getRecipeBySlug(slug));
  }, [slug]);

  const handleSaveRecipe = () => {
    if (!recipe) return;
    const saved = saveRecipesFromPlan([{...recipe, name: recipe.title}]);
    if(saved.length > 0) {
      toast({
          title: "Recipe Saved!",
          description: `${recipe.title} has been added to your collection.`,
      });
    } else {
       toast({
          title: "Already Saved",
          description: "This recipe is already in your collection.",
      });
    }
  };

  const handleAddToShoppingList = () => {
    if (recipe) {
      const addedCount = addIngredientsToShoppingList(recipe.ingredients);
      toast({
        title: "Shopping List Updated",
        description: `${addedCount} new ingredients have been added to your shopping list.`,
      });
    }
  };

  if (!isClient) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p>Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                 <Image 
                    src={recipe.image || `https://placehold.co/1200x600.png`} 
                    alt={recipe.title} 
                    width={1200} 
                    height={600} 
                    className="w-full h-48 md:h-64 object-cover" 
                    data-ai-hint={recipe.hint}
                />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                <Badge variant="secondary">{recipe.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">{recipe.title}</h1>
                <p className="text-muted-foreground mt-2">{recipe.description}</p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             <Button onClick={handleSaveRecipe} variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Recipe
            </Button>
            <Button onClick={handleAddToShoppingList}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Shopping List
            </Button>
        </div>


        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Apple className="h-5 w-5 text-primary"/> Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
                 <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="flex items-start">
                           <Dot className="h-4 w-4 mt-1 flex-shrink-0" />
                           <span>{ingredient}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-primary"/> Instructions</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal list-inside space-y-4">
                    {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ol>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Nutritional Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="font-bold text-lg">{recipe.calories}</p>
                        <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="font-bold text-lg">{recipe.macros.protein}</p>
                        <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="font-bold text-lg">{recipe.macros.carbs}</p>
                        <p className="text-sm text-muted-foreground">Carbs</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="font-bold text-lg">{recipe.macros.fat}</p>
                        <p className="text-sm text-muted-foreground">Fat</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
