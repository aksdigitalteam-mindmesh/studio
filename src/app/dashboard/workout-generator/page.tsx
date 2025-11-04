
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
import { Loader2, VideoOff, CheckCircle, ShieldAlert, Calendar, Dumbbell, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUsageTracker } from "@/hooks/use-usage-tracker";
import { useAuthContext } from "@/hooks/use-auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";

type Exercise = {
  name: string;
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
  const { canUse, recordUsage, usagesLeft } = useUsageTracker();
  const { user } = useAuthContext();
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
                    intensity: form.getValues('intensity'),
                    equipment: form.getValues('equipment'),
                    bodyFocus: form.getValues('bodyFocus'),
                });
            }
        }
    }
    fetchUserData();
  }, [user, firestore, form]);


  function onSubmit(values: z.infer<typeof workoutPlanSchema>) {
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
      const response = await generateWorkoutPlanAction(values);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error Generating Workout",
          description: response.error,
        });
      }
      if (response.data) {
        recordUsage(); // Record usage only on success
        setResult(response.data);
        try {
          localStorage.setItem('latestWorkoutPlan', JSON.stringify(response.data));
        } catch (e) {
            console.error("Could not save workout plan to local storage", e);
             toast({
              variant: "destructive",
              title: "Could not save workout",
              description: "There was an issue saving your workout plan for the dashboard.",
            });
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

  const isAtLimit = !canUse();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>Tell us what you're looking for in a workout.</CardDescription>
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
                      <FormLabel>Workout Time Per Day (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 60" {...field} />
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
                      <FormLabel>Days Per Week</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
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
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="with" />
                            </FormControl>
                            <FormLabel className="font-normal">With Equipment</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="without" />
                            </FormControl>
                            <FormLabel className="font-normal">Without Equipment</FormLabel>
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
                      <FormLabel>Desired Intensity</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
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
                <Button type="submit" disabled={isPending || isAtLimit} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate 7-Day Workout"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
            <CardHeader>
                <CardTitle>Your Personalized Workout</CardTitle>
                <CardDescription>Your AI-generated 7-day workout plan will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {isPending && (
                <div className="flex h-full flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Generating your workout and videos...</p>
                    <p className="text-sm text-muted-foreground">(This may take a minute or two)</p>
                </div>
            )}
            {result && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <h2 className="text-2xl font-bold font-headline">{result.title}</h2>
                    <p className="text-muted-foreground mt-2">{result.description}</p>
                  </div>
                   <Button onClick={handleSavePlan} className="w-full">
                      <Star className="mr-2 h-4 w-4" />
                      Set as My Active Workout Plan
                    </Button>
                  <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
                    {result.weeklySchedule.map((day) => (
                       <AccordionItem value={`day-${day.day}`} key={day.day}>
                         <AccordionTrigger>
                           <div className="flex items-center gap-4">
                             <div className="bg-primary/10 p-3 rounded-full">
                               <Calendar className="h-6 w-6 text-primary" />
                             </div>
                             <div>
                               <p className="font-semibold text-left">Day {day.day}: {day.title}</p>
                               <p className="text-sm text-muted-foreground text-left">{day.description}</p>
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
                                                    {exercise.videoUrl !== 'error' ? (
                                                        <video src={exercise.videoUrl} loop autoPlay muted playsInline className="h-full w-full object-cover"></video>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-destructive">
                                                            <VideoOff className="h-6 w-6" />
                                                            <span className="text-xs">No video</span>
                                                        </div>
                                                    )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-left">{exercise.name}</p>
                                                        <p className="text-sm text-muted-foreground text-left">{exercise.sets} sets, {exercise.reps} reps</p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="prose dark:prose-invert prose-sm max-w-none pl-4 border-l-2 ml-5">
                                                    <p><strong>Rest:</strong> {exercise.rest}</p>
                                                    <p><strong>Muscles:</strong> {exercise.muscleGroups?.join(', ')}</p>
                                                    {exercise.videoUrl === 'error' && (
                                                        <Alert variant="destructive" className="mt-2">
                                                        <AlertTitle>Video Generation Failed</AlertTitle>
                                                        <AlertDescription>
                                                            We couldn't generate a video for this exercise.
                                                        </AlertDescription>
                                                        </Alert>
                                                    )}
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
                    <p className="text-muted-foreground">Waiting for generation...</p>
                 </div>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
