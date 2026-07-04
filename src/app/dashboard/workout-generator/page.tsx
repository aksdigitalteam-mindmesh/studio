
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
import { useState, useTransition, useEffect } from "react";
import { Loader2, Calendar, Star, ImageOff, Library } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useUsageTracker } from "@/hooks/use-usage-tracker";
import { useAuthContext } from "@/hooks/use-auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import Image from "next/image";

type Exercise = {
  name: string;
  exerciseId: string;
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
  muscleGroups?: string[];
};

type DailyWorkout = {
    day: number;
    title: string;
    description: string;
    exercises?: Exercise[];
};

type WorkoutPlan = {
  title: string;
  description: string;
  weeklySchedule: DailyWorkout[];
};

export default function WorkoutGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();
  const { recordUsage } = useUsageTracker();
  const { user, profile } = useAuthContext();
  const { firestore } = useFirebase();

  const form = useForm<z.infer<typeof workoutPlanSchema>>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      fitnessGoals: "Build muscle and increase strength",
      intensity: "medium",
      duration: 60,
      daysPerWeek: 5,
      equipment: "with",
      bodyFocus: "",
    },
  });

  useEffect(() => {
    async function fetchUserData() {
        if (user && firestore) {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                form.reset({
                    duration: userData.workoutDuration || 60,
                    daysPerWeek: userData.workoutDaysPerWeek || 5,
                    fitnessGoals: form.getValues('fitnessGoals'),
                    intensity: userData.intensity || 'medium',
                    equipment: form.getValues('equipment'),
                    bodyFocus: form.getValues('bodyFocus'),
                });
            }
        }
    }
    fetchUserData();
  }, [user, firestore, form]);


  function onSubmit(values: z.infer<typeof workoutPlanSchema>) {
    setResult(null);
    startTransition(async () => {
      const response = await generateWorkoutPlanAction({
          ...values,
          medicalConditions: profile?.medicalConditions
      });
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error Generating Workout",
          description: response.error,
        });
      }
      if (response.data) {
        recordUsage();
        setResult(response.data);
        try {
          localStorage.setItem('latestWorkoutPlan', JSON.stringify(response.data));
        } catch (e) {
            console.error("Could not save workout plan", e);
        }
      }
    });
  }
  
  const handleSavePlan = () => {
    if (result) {
      localStorage.setItem('latestWorkoutPlan', JSON.stringify(result));
      toast({
        title: "Workout Plan Saved!",
        description: `Your new workout plan is now active on your dashboard.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan Preferences</CardTitle>
            <CardDescription>We'll build your plan using our inbuilt exercise library.</CardDescription>
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
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Daily Mins</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="daysPerWeek"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Days / Week</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Equipment</FormLabel>
                       <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="with" /></FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="without" /></FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel>Intensity</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="low" /></FormControl>
                            <FormLabel className="font-normal">Low</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="medium" /></FormControl>
                            <FormLabel className="font-normal">Med</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="high" /></FormControl>
                            <FormLabel className="font-normal">High</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Building Plan...
                    </>
                  ) : (
                      <>
                        <Library className="mr-2 h-4 w-4" />
                        Build My Workout
                      </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle>Generated Workout</CardTitle>
                <CardDescription>Your 7-day plan from our local exercise library.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Selecting exercises...</p>
                </div>
            )}
            {result && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
                    <p className="text-muted-foreground mt-2">{result.description}</p>
                  </div>
                   <Button onClick={handleSavePlan} className="w-full" variant="secondary">
                      <Star className="mr-2 h-4 w-4" />
                      Set as Active Plan
                    </Button>
                  <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
                    {result.weeklySchedule.map((day) => (
                       <AccordionItem value={`day-${day.day}`} key={day.day}>
                         <AccordionTrigger>
                           <div className="flex items-center gap-4">
                             <div className="bg-primary/10 p-3 rounded-full">
                               <Calendar className="h-6 w-6 text-primary" />
                             </div>
                             <div className="text-left">
                               <p className="font-semibold">Day {day.day}: {day.title}</p>
                               <p className="text-sm text-muted-foreground">{day.exercises?.length || 0} exercises</p>
                             </div>
                           </div>
                         </AccordionTrigger>
                         <AccordionContent>
                           {day.exercises && day.exercises.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {day.exercises.map((exercise, index) => (
                                         <AccordionItem value={`exercise-${index}`} key={index}>
                                            <AccordionTrigger>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-16 w-28 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                                    {exercise.videoUrl && exercise.videoUrl !== 'error' ? (
                                                        <Image src={exercise.videoUrl} alt={exercise.name} layout="fill" objectFit="cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-muted-foreground">
                                                            <ImageOff className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-semibold">{exercise.name}</p>
                                                        <p className="text-sm text-muted-foreground">{exercise.sets} sets, {exercise.reps} reps</p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="prose dark:prose-invert prose-sm max-w-none pl-4 border-l-2 ml-5">
                                                    <p><strong>Rest:</strong> {exercise.rest}</p>
                                                    <p><strong>Muscles:</strong> {exercise.muscleGroups?.join(', ')}</p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                           ) : (
                             <div className="text-center p-4 text-muted-foreground">
                                <p>Rest Day - a great time to recover!</p>
                            </div>
                           )}
                         </AccordionContent>
                       </AccordionItem>
                    ))}
                  </Accordion>
                </div>
            )}
            {!isPending && !result && (
                 <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    <p className="text-muted-foreground">Choose preferences and click build.</p>
                 </div>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
