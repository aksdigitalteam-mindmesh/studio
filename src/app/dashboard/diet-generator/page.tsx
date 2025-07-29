"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateDietPlanAction, dietPlanSchema } from "@/lib/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumBadge } from "@/components/premium-badge";

type DietPlan = { 
  dietPlan: string;
  calorieRecommendation: number;
  macroRecommendation: string;
};

export default function DietGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof dietPlanSchema>>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: {
      fitnessGoals: "",
      calorieTarget: 2000,
      macroRatio: "40% protein, 40% carbs, 20% fat",
      dietaryRestrictions: "",
      foodPreferences: "",
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
        setResult(response.data);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline md:text-4xl">AI Diet Plan Generator</h1>
            <p className="text-muted-foreground">Craft your perfect meal plan with the power of AI.</p>
        </div>
        <PremiumBadge />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Your Personalized Diet Plan</CardTitle>
                <CardDescription>Your AI-generated diet plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {result && (
                <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
                    <h3 className="font-headline">Recommended Plan</h3>
                    <p>{result.dietPlan}</p>
                    <h4 className="font-headline">Calorie Recommendation</h4>
                    <p>{result.calorieRecommendation} kcal / day</p>
                    <h4 className="font-headline">Macro Recommendation</h4>
                    <p>{result.macroRecommendation}</p>
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
