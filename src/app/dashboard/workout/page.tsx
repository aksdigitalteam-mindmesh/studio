
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, CheckCircle, Flame } from "lucide-react";
import Link from "next/link";
import { saveCompletedWorkoutAction, getCompletedWorkouts } from "@/lib/workout-log-actions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
};

type WorkoutPlan = {
  title: string;
  description: string;
  exercises: Exercise[];
};

type CompletedWorkout = {
  title: string;
  date: string;
};

export default function WorkoutPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedPlan = localStorage.getItem("latestWorkoutPlan");
    if (storedPlan) {
      const plan = JSON.parse(storedPlan);
      setWorkoutPlan(plan);

      // Load completion status for this specific plan
      const storedCompletion = localStorage.getItem(`workoutCompletion_${plan.title}`);
      if (storedCompletion) {
        setCompletedExercises(JSON.parse(storedCompletion));
      }
    }
    
    // Load workout log
    setCompletedWorkouts(getCompletedWorkouts());
  }, []);

  useEffect(() => {
    // Save completion status whenever it changes
    if (workoutPlan) {
      localStorage.setItem(`workoutCompletion_${workoutPlan.title}`, JSON.stringify(completedExercises));
    }
  }, [completedExercises, workoutPlan]);

  const handleToggleExercise = (exerciseName: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };
  
  const handleCompleteWorkout = () => {
    if (workoutPlan) {
      saveCompletedWorkoutAction(workoutPlan.title);
      toast({
        title: "Workout Completed!",
        description: `Great job! "${workoutPlan.title}" has been added to your log.`,
      });
      // Update the log on this page immediately
      setCompletedWorkouts(getCompletedWorkouts());
    }
  };

  const completionPercentage = workoutPlan
    ? (completedExercises.length / workoutPlan.exercises.length) * 100
    : 0;

  if (!workoutPlan) {
    return (
      <div className="p-4 md:p-8 space-y-8 pb-24">
         <div>
            <h1 className="text-3xl font-bold font-headline md:text-4xl">Today's Workout</h1>
            <p className="text-muted-foreground">Your active workout plan will be shown here.</p>
        </div>
        <Card className="flex flex-col items-center justify-center min-h-[400px]">
          <CardHeader className="text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle>No Active Workout</CardTitle>
            <CardDescription>
              Go to the "Programs" tab to generate a new workout plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/programs">Generate Workout</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">{workoutPlan.title}</h1>
        <p className="text-muted-foreground">{workoutPlan.description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Workout Progress</CardTitle>
          <CardDescription>{completedExercises.length} of {workoutPlan.exercises.length} exercises completed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {workoutPlan.exercises.map((exercise) => (
          <Card key={exercise.name}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="relative h-20 w-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                   {exercise.videoUrl && exercise.videoUrl !== 'error' ? (
                     <video src={exercise.videoUrl} loop autoPlay muted playsInline className="h-full w-full object-cover"></video>
                   ) : (
                      <Dumbbell className="h-8 w-8 text-muted-foreground" />
                   )}
                 </div>
                 <div>
                   <h3 className="font-semibold">{exercise.name}</h3>
                   <p className="text-sm text-muted-foreground">{exercise.sets} sets x {exercise.reps} reps</p>
                   <p className="text-xs text-muted-foreground">Rest: {exercise.rest}</p>
                 </div>
              </div>
              <Checkbox
                checked={completedExercises.includes(exercise.name)}
                onCheckedChange={() => handleToggleExercise(exercise.name)}
                className="h-6 w-6"
                aria-label={`Mark ${exercise.name} as complete`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

       <Button onClick={handleCompleteWorkout} size="lg" className="w-full">
          <CheckCircle className="mr-2 h-5 w-5" />
          Mark Workout as Complete
        </Button>
      
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Flame className="text-primary"/>
                Workout Log
            </CardTitle>
            <CardDescription>A history of your completed workouts.</CardDescription>
        </CardHeader>
        <CardContent>
            {completedWorkouts.length > 0 ? (
                <ul className="space-y-4 max-h-64 overflow-y-auto">
                    {completedWorkouts.slice().reverse().map((workout, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Dumbbell className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">{workout.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(workout.date), "MMMM dd, yyyy")}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>You haven't logged any workouts yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
