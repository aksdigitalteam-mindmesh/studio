
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, BrainCircuit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSavedRecipes, getDiscoverableRecipes, deleteRecipe } from "@/lib/recipe-actions";
import type { Recipe } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [discoverRecipes, setDiscoverRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const refreshRecipes = () => {
    setSavedRecipes(getSavedRecipes());
    setDiscoverRecipes(getDiscoverableRecipes());
  };

  useEffect(() => {
    refreshRecipes();
  }, []);
  
  const handleDeleteRecipe = (e: React.MouseEvent, slug: string) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    deleteRecipe(slug);
    toast({
      title: "Recipe Removed",
      description: "The recipe has been removed from your saved list.",
    });
    refreshRecipes(); // Refresh the list from localStorage
  };

  const filteredSavedRecipes = savedRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDiscoverRecipes = discoverRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !savedRecipes.some(saved => saved.slug === recipe.slug) // Exclude saved recipes from discover list
  );

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Healthy Recipes</h1>
        <p className="text-muted-foreground">Find delicious and healthy meals.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for recipes..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Diet Plan</CardTitle>
          <CardDescription>Generate a personalized diet plan using our AI coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard/programs?tab=diet">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Generate Your Diet Plan
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Separator />
      
      {/* Saved Recipes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Bookmark className="text-primary" />
            Your Saved Recipes
        </h2>
        {filteredSavedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSavedRecipes.map((recipe, index) => (
                <Link href={`/dashboard/recipes/${recipe.slug}`} key={`saved-${recipe.slug}-${index}`}>
                    <Card className="overflow-hidden h-full transition-transform transform hover:scale-105 duration-300 group">
                    <CardHeader className="p-0 relative">
                        <Image src={recipe.image || "https://placehold.co/600x400.png"} alt={recipe.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={recipe.hint} />
                         <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteRecipe(e, recipe.slug)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove recipe</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        <p className="text-sm font-semibold text-primary">{recipe.category}</p>
                        <CardTitle className="mt-1 text-lg">{recipe.title}</CardTitle>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
        ) : (
            <p className="text-muted-foreground">You haven't saved any recipes yet. Generate a diet plan to save some!</p>
        )}
      </div>

      <Separator />

      {/* Discover Recipes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline">Discover New Recipes</h2>
         {filteredDiscoverRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDiscoverRecipes.map((recipe, index) => (
                <Link href={`/dashboard/recipes/${recipe.slug}`} key={`discover-${recipe.slug}-${index}`}>
                    <Card className="overflow-hidden h-full transition-transform transform hover:scale-105 duration-300">
                    <CardHeader className="p-0">
                        <Image src={recipe.image || "https://placehold.co/600x400.png"} alt={recipe.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={recipe.hint} />
                    </CardHeader>
                    <CardContent className="p-4">
                        <p className="text-sm font-semibold text-primary">{recipe.category}</p>
                        <CardTitle className="mt-1 text-lg">{recipe.title}</CardTitle>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
        ) : (
             <p className="text-muted-foreground">No new recipes to discover at the moment.</p>
        )}
      </div>

    </div>
  );
}
