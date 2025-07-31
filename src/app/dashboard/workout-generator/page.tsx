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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateWorkoutPlanAction } from "@/lib/actions";
import { workoutPlanSchema } from "@/lib/schemas";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  imageUrl: string;
};

type WorkoutPlan = {
  title: string;
  description: string;
  exercises: Exercise[];
};

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
      <div className="grid grid-cols-1 gap-8">
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

        <Card className="flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle>Your Personalized Workout</CardTitle>
                <CardDescription>Your AI-generated workout plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Generating your workout and images...</p>
                    <p className="text-sm text-muted-foreground">(This may take a moment)</p>
                </div>
            )}
            {result && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
                    <p className="text-muted-foreground">{result.description}</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {result.exercises.map((exercise, index) => (
                       <AccordionItem value={`item-${index}`} key={index}>
                         <AccordionTrigger>
                           <div className="flex items-center gap-4">
                             <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image src={exercise.imageUrl} alt={exercise.name} layout="fill" objectFit="cover" />
                             </div>
                             <div>
                               <p className="font-semibold text-left">{exercise.name}</p>
                               <p className="text-sm text-muted-foreground text-left">{exercise.sets} sets, {exercise.reps} reps</p>
                             </div>
                           </div>
                         </AccordionTrigger>
                         <AccordionContent>
                           <div className="prose dark:prose-invert prose-sm max-w-none">
                              <p><strong>Rest:</strong> {exercise.rest}</p>
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
