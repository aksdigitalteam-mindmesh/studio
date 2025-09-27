
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateDietPlanAction } from "@/lib/actions";
import { dietPlanSchema } from "@/lib/schemas";
import { useState, useTransition } from "react";
import { Loader2, Apple, ChefHat, Dot, ShoppingCart, Bookmark, ShieldAlert, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Meal } from "@/lib/types";
import { saveRecipesFromPlan } from "@/lib/recipe-actions";
import { useUsageTracker } from "@/hooks/use-usage-tracker";
import { addIngredientsToShoppingList } from "@/lib/shopping-list-actions";

type DailyPlan = {
  day: number;
  meals: Meal[];
  dailyTotals: {
    calories: number;
    macros: { protein: string, carbs: string, fat: string };
  };
};

type DietPlan = {
  title: string;
  summary: string;
  dailyPlans: DailyPlan[];
};

export default function DietGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DietPlan | null>(null);
  const { toast } = useToast();
  const { canUse, recordUsage } = useUsageTracker();


  const form = useForm<z.infer<typeof dietPlanSchema>>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: {
      fitnessGoals: "Lose weight and build lean muscle",
      calorieTarget: 2200,
      macroRatio: "40% protein, 30% carbs, 30% fat",
      cuisine: "Mediterranean",
      dietaryRestrictions: "None",
      foodPreferences: "I enjoy spicy food, chicken, and vegetables.",
    },
  });

  function onSubmit(values: z.infer<typeof dietPlanSchema>) {
     if (!canUse()) {
        toast({
          variant: "destructive",
          title: "Usage Limit Reached",
          description: "You have used all your AI generations for this week.",
        });
        return;
    }
    setResult(null);
    startTransition(async () => {
      const response = await generateDietPlanAction(values);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      }
      if (response.data) {
        recordUsage(); // Record usage only on success
        setResult(response.data as DietPlan);
      }
    });
  }

  const handleSavePlan = () => {
    if (result) {
      const allMeals = result.dailyPlans.flatMap(day => day.meals);
      const saved = saveRecipesFromPlan(allMeals);
      if(saved.length > 0) {
        toast({
            title: "Plan Saved!",
            description: `${saved.length} new recipes have been added to your collection.`,
        });
      } else {
         toast({
            title: "Already Saved",
            description: "These recipes are already in your collection.",
        });
      }
    }
  };

  const handleAddToShoppingList = () => {
    if (result) {
      const allIngredients = result.dailyPlans.flatMap(day => day.meals.flatMap(meal => meal.recipe.ingredients));
      const addedCount = addIngredientsToShoppingList(allIngredients);
      toast({
        title: "Shopping List Updated",
        description: `${addedCount} new ingredients have been added to your shopping list.`,
      });
    }
  };

  const isAtLimit = !canUse();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Provide your information to get a tailored 7-day diet plan.</CardDescription>
          </CardHeader>
          <CardContent>
             {isAtLimit && (
                 <Alert variant="destructive" className="mb-6">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Weekly Limit Reached</AlertTitle>
                    <AlertDescription>You have used all your AI generations for the week. Please check back later.</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fitnessGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goals</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lose weight, build muscle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="calorieTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Calorie Target</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2000" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="macroRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Macro Ratio</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 40% protein, 40% carbs, 20% fat" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Cuisine (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Italian, Mexican, Indian" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Restrictions (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., vegetarian, gluten-free, no dairy" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="foodPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Preferences (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., I love chicken, I dislike fish" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending || isAtLimit} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate 7-Day Diet Plan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle>Your Personalized Diet Plan</CardTitle>
                <CardDescription>Your AI-generated diet plan and recipes will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {result && (
                <div className="space-y-6">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                        <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
                        <p className="text-muted-foreground mt-2">{result.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button onClick={handleSavePlan} variant="outline">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save All Recipes
                      </Button>
                      <Button onClick={handleAddToShoppingList}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Shopping List
                      </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
                      {result.dailyPlans.map((dayPlan) => (
                        <AccordionItem value={`day-${dayPlan.day}`} key={dayPlan.day}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-4 w-full">
                               <div className="bg-primary/10 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-grow text-left">
                                <p className="font-semibold">Day {dayPlan.day}</p>
                                 <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <span>{dayPlan.dailyTotals.calories} kcal</span>
                                    <Dot/>
                                    <span>P: {dayPlan.dailyTotals.macros.protein}</span>
                                    <Dot className="hidden sm:block"/>
                                    <span className="hidden sm:block">C: {dayPlan.dailyTotals.macros.carbs}</span>
                                     <Dot className="hidden sm:block"/>
                                    <span className="hidden sm:block">F: {dayPlan.dailyTotals.macros.fat}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                             <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                {dayPlan.meals.map((meal, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <ChefHat className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-left">{meal.name}</p>
                                            <p className="text-sm text-muted-foreground text-left">{meal.description}</p>
                                        </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pl-4 border-l-2 border-primary/20 ml-5">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold flex items-center gap-2"><Apple className="h-4 w-4" /> Ingredients</h4>
                                                <ul className="space-y-1">
                                                    {meal.recipe.ingredients.map((ingredient, i) => (
                                                        <li key={i} className="flex items-start">
                                                        <Dot className="h-4 w-4 mt-1 flex-shrink-0" /><span>{ingredient}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold flex items-center gap-2"><ChefHat className="h-4 w-4" /> Instructions</h4>
                                                <ol className="list-decimal list-inside space-y-2">
                                                {meal.recipe.instructions.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                                </ol>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                                                <div className="p-2 bg-muted rounded-md">
                                                    <p className="font-semibold">Calories</p>
                                                    <p>{meal.calories} kcal</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded-md">
                                                    <p className="font-semibold">Protein</p>
                                                    <p>{meal.macros.protein}</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded-md">
                                                    <p className="font-semibold">Fat</p>
                                                    <p>{meal.macros.fat}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                    </AccordionItem>
                                ))}
                                </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                </div>
            )}
            {!isPending && !result && (
                 <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    <p className="text-muted-foreground">Waiting for generation...</p>
                 </div>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
