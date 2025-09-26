
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, CheckCircle, Flame, BarChart3, BrainCircuit, ArrowLeft, PlusCircle, Timer, SkipForward, ChevronRight, Play, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { saveCompletedWorkoutAction, getCompletedWorkouts } from "@/lib/workout-log-actions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";


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

type CompletedWorkout = {
  title:string;
  date: string;
};

type View = "hub" | "workout" | "progress";
type SessionState = "preview" | "exercise" | "rest" | "completed";


// --- Progress Tracker Components & Logic ---
const initialWeightData = [
  { date: "2024-05-01", weight: 80.0 },
  { date: "2024-05-08", weight: 79.5 },
  { date: "2024-05-15", weight: 78.7 },
  { date: "2024-05-22", weight: 77.8 },
  { date: "2024-05-29", weight: 77.1 },
];
const WEIGHT_STORAGE_KEY = 'weightData';

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function ProgressTracker() {
  const [weightData, setWeightData] = useState(initialWeightData);
  const [targetWeight, setTargetWeight] = useState(70);
  const [currentWeight, setCurrentWeight] = useState("");
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem(WEIGHT_STORAGE_KEY);
    setWeightData(savedData ? JSON.parse(savedData) : initialWeightData);
    setCompletedWorkouts(getCompletedWorkouts());
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(weightData));
    }
  }, [weightData, isClient]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight) {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(currentWeight),
      };
      setWeightData([...weightData, newEntry]);
      setCurrentWeight("");
    }
  };

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Progress Chart</CardTitle>
          <CardDescription>Current: {isClient && weightData.length > 0 ? weightData[weightData.length-1].weight : 'N/A'}kg | Target: {targetWeight}kg</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={weightData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={2} dot={true} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Flame className="text-primary"/> Workout Log</CardTitle>
          <CardDescription>A history of your completed workouts.</CardDescription>
        </CardHeader>
        <CardContent>
          {isClient && completedWorkouts.length > 0 ? (
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {completedWorkouts.slice().reverse().map((workout, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{workout.title}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(workout.date), "MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (<div className="text-center text-muted-foreground py-8"><p>You haven't logged any workouts yet.</p></div>)}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
         <Card>
          <CardHeader><CardTitle>Log Your Weight</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Today's Weight (kg)</Label>
                <Input id="currentWeight" type="number" step="0.1" placeholder="e.g., 75.2" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Entry</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Target Weight</CardTitle></CardHeader>
          <CardContent>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Set Target (kg)</Label>
                <Input id="targetWeight" type="number" step="0.1" value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))} />
              </div>
              <Button type="submit" className="w-full">Set Target</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// --- Workout Log Components & Logic ---
const REST_DURATION_SECONDS = 30;

function WorkoutLog() {
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


// --- Main Hub Component ---
function HubView({ setView }: { setView: (view: View) => void }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const bubbleCommonClass = "w-32 h-32 rounded-full flex flex-col items-center justify-center text-center p-2 text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl";

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center overflow-hidden">
            <h1 className={cn("text-3xl font-bold font-headline md:text-4xl transition-opacity duration-500", isMounted ? "opacity-100" : "opacity-0")}>Activity Hub</h1>
            <p className={cn("text-muted-foreground mb-12 transition-opacity duration-500 delay-200", isMounted ? "opacity-100" : "opacity-0")}>
                Track your workouts and monitor your progress.
            </p>
            <div className="relative w-full max-w-xs h-72 flex items-center justify-center">
                 <button
                    onClick={() => setView('workout')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-blue-500 to-cyan-500 hover:shadow-blue-400/40 hover:scale-105",
                        isMounted ? "opacity-100 -translate-y-4" : "opacity-0 -translate-y-0"
                    )}
                    style={{ top: '0', left: '50%', transform: 'translateX(-50%)', transitionDelay: '200ms' }}
                >
                    <Dumbbell className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Start Workout</span>
                </button>

                <button
                    onClick={() => setView('progress')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-green-400 to-emerald-500 hover:shadow-green-400/40 hover:scale-105",
                         isMounted ? "opacity-100 translate-y-4 -translate-x-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', left: '0', transitionDelay: '400ms' }}
                >
                    <BarChart3 className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Progress</span>
                </button>
                
                 <Link
                    href="/dashboard/programs?tab=workout"
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-purple-500 to-indigo-600 hover:shadow-purple-400/40 hover:scale-105",
                        isMounted ? "opacity-100 translate-y-4 translate-x-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', right: '0', transitionDelay: '600ms' }}
                >
                    <BrainCircuit className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">AI Coach</span>
                </Link>
            </div>
        </div>
    );
};


// --- Main Page Component ---
function ActivityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialView = searchParams.get("view") as View | null;
  const [view, setView] = useState<View>("hub");

  useEffect(() => {
    // Only set view from params on initial load if it's valid
    if (initialView && ["hub", "workout", "progress"].includes(initialView)) {
      setView(initialView);
    }
  }, [initialView]);

  const handleSetView = useCallback((newView: View) => {
      setView(newView);
      router.push(`/dashboard/workout?view=${newView}`, { scroll: false });
  }, [router]);

  const handleGoToHub = () => {
    setView('hub');
    router.push('/dashboard/workout', { scroll: false });
  }

  const PageContent = () => {
    switch (view) {
      case "workout":
        return <WorkoutLog />;
      case "progress":
        return <ProgressTracker />;
      default:
        return <HubView setView={handleSetView} />;
    }
  };

  return (
     <div className="p-4 md:p-8 space-y-8 pb-24">
        {view !== 'hub' && (
            <Button variant="outline" onClick={handleGoToHub}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activity Hub
            </Button>
        )}
        <PageContent />
     </div>
  )
}

export default function WorkoutPage() {
    return (
        <Suspense>
            <ActivityPage />
        </Suspense>
    )
}

    