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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { generateWorkoutPlanAction, workoutPlanSchema } from "@/lib/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumBadge } from "@/components/premium-badge";

type WorkoutPlan = { workoutPlan: string };

export default function WorkoutGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof workoutPlanSchema>>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      fitnessGoals: "",
      intensity: "medium",
      duration: 30,
      bodyFocus: "",
    },
  });

  function onSubmit(values: z.infer<typeof workoutPlanSchema>) {
    setResult(null);
    startTransition(async () => {
      const response = await generateWorkoutPlanAction(values);
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
            <h1 className="text-3xl font-bold font-headline md:text-4xl">AI Workout Plan Generator</h1>
            <p className="text-muted-foreground">Let our AI build the perfect workout for you.</p>
        </div>
        <PremiumBadge />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>Tell us what you're looking for in a workout.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fitnessGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Fitness Goal</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lose weight, build muscle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 45" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Desired Intensity</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="low" />
                            </FormControl>
                            <FormLabel className="font-normal">Low</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal">Medium</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="high" />
                            </FormControl>
                            <FormLabel className="font-normal">High</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bodyFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Part Focus (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Legs, Core, Arms" {...field} />
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
                  ) : "Generate Workout"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Your Personalized Workout</CardTitle>
                <CardDescription>Your AI-generated workout plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {result && (
                <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none whitespace-pre-wrap font-body">
                    {result.workoutPlan}
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
