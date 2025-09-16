
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
import { Loader2, Apple, ChefHat, Dot, ShoppingCart, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Meal } from "@/lib/types";
import { saveRecipesFromPlan } from "@/lib/recipe-actions";

type DietPlan = {
  title: string;
  summary: string;
  dailyTotals: {
    calorieRecommendation: number;
    macroRecommendation: string;
  };
  meals: Meal[];
};

export default function DietGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof dietPlanSchema>>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: {
      fitnessGoals: "Lose weight and build lean muscle",
      calorieTarget: 2200,
      macroRatio: "40% protein, 30% carbs, 30% fat",
      dietaryRestrictions: "None",
      foodPreferences: "I enjoy spicy food, chicken, and vegetables.",
    },
  });

  function onSubmit(values: z.infer<typeof dietPlanSchema>) {
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
        setResult(response.data as DietPlan);
      }
    });
  }

  const handleSavePlan = () => {
    if (result) {
      const saved = saveRecipesFromPlan(result.meals);
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Provide your information to get a tailored diet plan.</CardDescription>
          </CardHeader>
          <CardContent>
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
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate Diet Plan"}
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
                        <div className="flex justify-center items-center gap-4 mt-4 text-sm">
                            <Badge variant="outline">{result.dailyTotals.calorieRecommendation} kcal</Badge>
                            <Badge variant="outline">{result.dailyTotals.macroRecommendation}</Badge>
                        </div>
                    </div>
                    
                    <Button onClick={handleSavePlan} className="w-full">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save Plan to Recipes
                    </Button>

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                      {result.meals.map((meal, index) => (
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
                                    <ul className="space-y-2">
                                        {meal.recipe.ingredients.map((ingredient, i) => (
                                            <li key={i} className="flex justify-between items-center">
                                              <span className="flex items-center"><Dot className="h-4 w-4" />{ingredient}</span>
                                              <Button variant="ghost" size="icon">
                                                  <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
                                              </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold flex items-center gap-2"><ChefHat className="h-4 w-4" /> Instructions</h4>
                                    <ol className="list-decimal list-inside space-y-1">
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
                                        <p className="font-semibold">Carbs</p>
                                        <p>{meal.macros.carbs}</p>
                                    </div>
                                </div>
                             </div>
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
