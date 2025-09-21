
"use client";

import { useEffect, useState, use } from "react";
import { getRecipeBySlug, deleteRecipe } from "@/lib/recipe-actions";
import type { Recipe } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, ChefHat, Dot, ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function RecipeDetails({ slug }: { slug: string }) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const foundRecipe = getRecipeBySlug(slug);
        if (foundRecipe) {
            setRecipe(foundRecipe);
        }
    }, [slug]);

    const handleDelete = () => {
        if (recipe) {
            deleteRecipe(recipe.slug);
            toast({
                title: "Recipe Removed",
                description: `"${recipe.title}" has been removed from your saved list.`,
            });
            router.push("/dashboard/recipes");
        }
    };
    
    const isSavedRecipe = recipe?.slug.includes("-discover") === false;

    if (!recipe) {
        return (
            <div className="p-4 md:p-8">
                <Button asChild variant="outline">
                    <Link href="/dashboard/recipes">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
                    </Link>
                </Button>
                <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">Recipe not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8 pb-24">
             <div className="flex justify-between items-center mb-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard/recipes">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
                    </Link>
                </Button>

                {isSavedRecipe && (
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Recipe
                    </Button>
                )}
            </div>
            
            <Card className="overflow-hidden">
                <CardHeader className="p-0 relative h-64">
                    <Image src={recipe.image || "https://placehold.co/1200x400.png"} alt={recipe.title} layout="fill" objectFit="cover" data-ai-hint={recipe.hint} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                     <div className="absolute bottom-0 left-0 p-6">
                        <Badge>{recipe.category}</Badge>
                        <CardTitle className="text-3xl font-bold font-headline text-primary-foreground mt-2">{recipe.title}</CardTitle>
                        <CardDescription className="text-primary-foreground/80">{recipe.description}</CardDescription>
                     </div>
                </CardHeader>
                <CardContent className="p-6">
                     <div className="grid md:grid-cols-3 gap-2 text-center text-sm mb-6">
                        <div className="p-3 bg-muted rounded-md">
                            <p className="font-semibold">Calories</p>
                            <p>{recipe.calories} kcal</p>
                        </div>
                        <div className="p-3 bg-muted rounded-md">
                            <p className="font-semibold">Protein</p>
                            <p>{recipe.macros.protein}</p>
                        </div>
                            <div className="p-3 bg-muted rounded-md">
                            <p className="font-semibold">Carbs</p>
                            <p>{recipe.macros.carbs}</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl flex items-center gap-2"><Apple className="h-5 w-5 text-primary" /> Ingredients</h3>
                            <ul className="space-y-2 pl-2">
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i} className="flex items-center">
                                        <Dot className="h-4 w-4 text-primary" />
                                        <span>{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl flex items-center gap-2"><ChefHat className="h-5 w-5 text-primary" /> Instructions</h3>
                            <ol className="list-decimal list-inside space-y-2">
                                {recipe.instructions.map((step, i) => (
                                <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function RecipeDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    return <RecipeDetails slug={resolvedParams.slug} />;
}
