
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, CheckCircle, Timer, SkipForward, ChevronRight, Play, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { saveCompletedWorkoutAction } from "@/lib/workout-log-actions";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
  muscleGroups?: string[];
};

type WorkoutPlan = {
  title: string;
  description: string;
  weeklySchedule: {
    day: number;
    title: string;
    description: string;
    exercises: Exercise[];
  }[];
};

type SessionState = "preview" | "exercise" | "rest" | "completed";

// --- Component ---
const REST_DURATION_SECONDS = 30;

export function WorkoutLog() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>("preview");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimeLeft, setRestTimeLeft] = useState(REST_DURATION_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
  const currentDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const [activeDay, setActiveDay] = useState(currentDay);
  
  const activeWorkoutDay = workoutPlan?.weeklySchedule?.find(d => d.day === activeDay);
  const currentExercise = activeWorkoutDay?.exercises?.[currentExerciseIndex];

  // Load workout plan from local storage
  useEffect(() => {
    const storedPlan = localStorage.getItem("latestWorkoutPlan");
    if (storedPlan) {
      try {
        setWorkoutPlan(JSON.parse(storedPlan));
      } catch (error) {
        console.error("Failed to parse workout plan:", error);
        setWorkoutPlan(null);
      }
    }
  }, []);

  // Rest timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionState === 'rest' && !isPaused && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (sessionState === 'rest' && restTimeLeft <= 0) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [sessionState, restTimeLeft, isPaused]);


  const startSession = (index = 0) => {
    if (!activeWorkoutDay || !activeWorkoutDay.exercises || activeWorkoutDay.exercises.length === 0) {
      toast({ variant: "destructive", title: "It's a rest day!", description: "No exercises to perform today."});
      return;
    }
    setCurrentExerciseIndex(index);
    setSessionState('exercise');
  };

  const handleNext = () => {
    if (!activeWorkoutDay?.exercises) return;

    setIsPaused(false); // Make sure timer isn't paused
    setRestTimeLeft(REST_DURATION_SECONDS);

    if (currentExerciseIndex < activeWorkoutDay.exercises.length - 1) {
      setSessionState('rest');
    } else {
      setSessionState('completed');
    }
  };
  
  const handleRestEnd = () => {
      setSessionState('exercise');
      setCurrentExerciseIndex(prev => prev + 1);
  }

  useEffect(() => {
    if (sessionState === 'rest' && restTimeLeft <= 0) {
      handleRestEnd();
    }
  }, [restTimeLeft, sessionState]);

  const skipRest = () => {
      setRestTimeLeft(0);
  }

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleCompleteWorkout = () => {
    if (activeWorkoutDay?.exercises) {
      const completedExerciseNames = activeWorkoutDay.exercises.map(ex => ex.name);
      saveCompletedWorkoutAction(activeWorkoutDay.title, completedExerciseNames);
      toast({ title: "Workout Completed!", description: `Great job! "${activeWorkoutDay.title}" has been added to your log.` });
      setSessionState('preview');
      setCurrentExerciseIndex(0);
    }
  };

  if (sessionState === "preview") {
    if (!workoutPlan) {
      return (
        <Card className="flex flex-col items-center justify-center text-center min-h-[400px]">
          <CardHeader>
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle>No Active Workout Plan</CardTitle>
            <CardDescription>Go to "AI Programs" to generate a new workout plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><Link href="/dashboard/programs?tab=workout">Generate Workout</Link></Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline md:text-4xl">{workoutPlan.title}</h1>
          <p className="text-muted-foreground">{workoutPlan.description}</p>
        </div>

        {workoutPlan.weeklySchedule && (
          <Card>
            <CardHeader><CardTitle>Week View</CardTitle></CardHeader>
            <CardContent className="flex justify-around">
              {workoutPlan.weeklySchedule.map(day => (
                <Button key={day.day} variant={activeDay === day.day ? "default" : "outline"} size="icon" onClick={() => setActiveDay(day.day)}>
                  {day.day}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {activeWorkoutDay && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Day {activeDay}: {activeWorkoutDay.title}</CardTitle>
                <CardDescription>{activeWorkoutDay.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => startSession()} size="lg" className="w-full" disabled={!activeWorkoutDay.exercises || activeWorkoutDay.exercises.length === 0}>
                  <Play className="mr-2 h-5 w-5" /> Start Full Workout
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {activeWorkoutDay.exercises && activeWorkoutDay.exercises.length > 0 ? (activeWorkoutDay.exercises.map((exercise, index) => (
                <Card key={exercise.name} onClick={() => startSession(index)} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-28 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {exercise.videoUrl && exercise.videoUrl !== 'error' ? (
                          <video src={exercise.videoUrl} loop autoPlay muted playsInline className="h-full w-full object-cover"></video>
                        ) : (<Dumbbell className="h-8 w-8 text-muted-foreground" />)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.sets} sets x {exercise.reps} reps</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))) : (
                <div className="text-center py-8 text-muted-foreground">This is a rest day. Enjoy your recovery!</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // --- GUIDED SESSION VIEWS ---

  if (sessionState === 'exercise' && currentExercise) {
     const progress = ((currentExerciseIndex + 1) / (activeWorkoutDay?.exercises?.length || 1)) * 100;
     return (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-background">
             <div className="flex items-center justify-between p-4">
                <Button variant="ghost" size="icon" onClick={() => setSessionState('preview')}>
                    <X className="h-6 w-6" />
                </Button>
                <div className="text-sm font-semibold">
                    {currentExerciseIndex + 1} / {activeWorkoutDay?.exercises?.length}
                </div>
            </div>
            <div className="w-full px-4 mb-2">
                <Progress value={progress} />
            </div>

            <div className="relative flex-grow w-full overflow-hidden rounded-lg bg-muted">
                 {currentExercise.videoUrl && currentExercise.videoUrl !== 'error' ? (
                    <video key={currentExercise.videoUrl} src={currentExercise.videoUrl} loop autoPlay muted playsInline className="h-full w-full object-cover"></video>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Dumbbell className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
            
            <div className="p-6 text-center bg-background space-y-2">
                <h2 className="text-2xl font-bold font-headline">{currentExercise.name}</h2>
                <p className="text-lg text-muted-foreground">{currentExercise.sets} sets x {currentExercise.reps} reps</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentExerciseIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4"/> Previous
                </Button>
                 <Button onClick={handleNext}>
                    Next <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
        </div>
     )
  }

  if (sessionState === 'rest') {
    const restProgress = ((REST_DURATION_SECONDS - restTimeLeft) / REST_DURATION_SECONDS) * 100;
    const nextExercise = activeWorkoutDay?.exercises?.[currentExerciseIndex + 1];
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-4">
            <Timer className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold font-headline mb-2">Take a Rest</h2>
            <p className="text-7xl font-bold font-mono my-8">{restTimeLeft}s</p>
            <Progress value={restProgress} className="w-full max-w-sm mb-8" />
             <Button onClick={skipRest} size="lg" className="w-full max-w-sm">
                <SkipForward className="mr-2 h-5 w-5"/> Skip Rest
            </Button>
            {nextExercise && <p className="text-muted-foreground mt-4">Next up: {nextExercise.name}</p>}
        </div>
    )
  }

  if (sessionState === 'completed') {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-4">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h2 className="text-4xl font-bold font-headline mb-2">Workout Complete!</h2>
            <p className="text-muted-foreground mb-8">You crushed {activeWorkoutDay?.exercises?.length} exercises today.</p>
            
            <Card className="w-full max-w-sm mb-8">
                <CardContent className="p-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{activeWorkoutDay?.exercises?.length}</p>
                        <p className="text-sm text-muted-foreground">Exercises</p>
                    </div>
                    <div className="text-center">
                         <p className="text-2xl font-bold">~350</p>
                        <p className="text-sm text-muted-foreground">Kcal Burned</p>
                    </div>
                </CardContent>
            </Card>

            <div className="w-full max-w-sm space-y-4">
                <Button onClick={handleCompleteWorkout} size="lg" className="w-full">
                    <CheckCircle className="mr-2 h-5 w-5"/> Log Workout
                </Button>
                <Button variant="outline" onClick={() => { setSessionState('preview'); setCurrentExerciseIndex(0); }} className="w-full">
                    Back to Workout List
                </Button>
            </div>
        </div>
    )
  }
  
  return null; // Should not happen
}

    