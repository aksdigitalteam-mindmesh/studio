

"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, CheckCircle, Flame, BarChart3, BrainCircuit, ArrowLeft, PlusCircle } from "lucide-react";
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
    exercises: Exercise[];
  }[];
};

type CompletedWorkout = {
  title:string;
  date: string;
};

type View = "hub" | "workout" | "progress";


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
  const [weightData, setWeightData] = useState(() => {
    if (typeof window === 'undefined') return initialWeightData;
    const savedData = localStorage.getItem(WEIGHT_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : initialWeightData;
  });
  const [targetWeight, setTargetWeight] = useState(70);
  const [currentWeight, setCurrentWeight] = useState("");
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(weightData));
    }
  }, [weightData]);

  useEffect(() => {
      setCompletedWorkouts(getCompletedWorkouts());
  }, []);

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
          <CardDescription>Current: {weightData.length > 0 ? weightData[weightData.length-1].weight : 'N/A'}kg | Target: {targetWeight}kg</CardDescription>
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
          {completedWorkouts.length > 0 ? (
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
function WorkoutLog() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const { toast } = useToast();
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
  const currentDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Adjust to 1-7 (Mon-Sun)
  
  const [activeDay, setActiveDay] = useState(currentDay);
  
  const activeWorkoutDay = workoutPlan?.weeklySchedule ? workoutPlan.weeklySchedule.find(d => d.day === activeDay) : undefined;


  useEffect(() => {
    const storedPlan = localStorage.getItem("latestWorkoutPlan");
    if (storedPlan) {
      try {
        const plan = JSON.parse(storedPlan);
        setWorkoutPlan(plan);
        if(plan.title) {
          const storedCompletion = localStorage.getItem(`workoutCompletion_${plan.title}_${activeDay}`);
          if (storedCompletion) setCompletedExercises(JSON.parse(storedCompletion));
        }
      } catch (error) {
        console.error("Failed to parse workout plan:", error);
        setWorkoutPlan(null);
      }
    }
  }, [activeDay]);

  useEffect(() => {
    if (workoutPlan && workoutPlan.title) {
      localStorage.setItem(`workoutCompletion_${workoutPlan.title}_${activeDay}`, JSON.stringify(completedExercises));
    }
  }, [completedExercises, workoutPlan, activeDay]);

  const handleToggleExercise = (exerciseName: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseName) ? prev.filter((name) => name !== exerciseName) : [...prev, exerciseName]
    );
  };
  
  const handleCompleteWorkout = () => {
    if (activeWorkoutDay && activeWorkoutDay.exercises) {
      saveCompletedWorkoutAction(activeWorkoutDay.title, completedExercises);
      toast({ title: "Workout Completed!", description: `Great job! "${activeWorkoutDay.title}" has been added to your log.` });
    }
  };

  if (!workoutPlan) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <CardHeader className="text-center">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground" />
          <CardTitle>No Active Workout</CardTitle>
          <CardDescription>Go to "AI Programs" to generate a new workout plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link href="/dashboard/programs">Generate Workout</Link></Button>
        </CardContent>
      </Card>
    );
  }

  const completionPercentage = activeWorkoutDay?.exercises ? (completedExercises.length / activeWorkoutDay.exercises.length) * 100 : 0;

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
                <CardDescription>{completedExercises.length} of {activeWorkoutDay.exercises?.length || 0} exercises completed.</CardDescription>
                </CardHeader>
                <CardContent><Progress value={completionPercentage} /></CardContent>
            </Card>

            <div className="space-y-4">
                {activeWorkoutDay.exercises && activeWorkoutDay.exercises.map((exercise) => (
                <Card key={exercise.name}>
                    <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {exercise.videoUrl && exercise.videoUrl !== 'error' ? (
                            <video src={exercise.videoUrl} loop autoPlay muted playsInline className="h-full w-full object-cover"></video>
                        ) : (<Dumbbell className="h-8 w-8 text-muted-foreground" />)}
                        </div>
                        <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.sets} sets x {exercise.reps} reps</p>
                        <p className="text-xs text-muted-foreground">Rest: {exercise.rest}</p>
                        </div>
                    </div>
                    <Checkbox checked={completedExercises.includes(exercise.name)} onCheckedChange={() => handleToggleExercise(exercise.name)} className="h-6 w-6" />
                    </CardContent>
                </Card>
                ))}
            </div>

            {activeWorkoutDay.exercises && activeWorkoutDay.exercises.length > 0 ? (
                <Button onClick={handleCompleteWorkout} size="lg" className="w-full"><CheckCircle className="mr-2 h-5 w-5" /> Mark Workout as Complete</Button>
            ) : (
                <div className="text-center py-8 text-muted-foreground">This is a rest day. Enjoy your recovery!</div>
            )}
        </>
      )}
      
    </div>
  );
}


// --- Main Hub Component ---
function HubView({ setView }: { setView: (view: View) => void }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation
        setIsMounted(true);
    }, []);

    const bubbleCommonClass = "w-32 h-32 rounded-full flex flex-col items-center justify-center text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl";

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center overflow-hidden">
            <h1 className={cn("text-3xl font-bold font-headline md:text-4xl transition-opacity duration-500", isMounted ? "opacity-100" : "opacity-0")}>Activity Hub</h1>
            <p className={cn("text-muted-foreground mb-12 transition-opacity duration-500 delay-200", isMounted ? "opacity-100" : "opacity-0")}>
                Track your workouts and monitor your progress.
            </p>
            <div className="relative w-full max-w-xs h-72 flex items-center justify-center">
                 <Link
                    href="/dashboard/programs"
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-purple-500 to-indigo-600 hover:shadow-purple-400/40 hover:scale-105",
                        isMounted ? "opacity-100 -translate-y-4" : "opacity-0"
                    )}
                    style={{ top: '0', left: '50%', transform: 'translateX(-50%)', transitionDelay: '200ms' }}
                >
                    <BrainCircuit className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">AI Coach</span>
                </Link>

                <button
                    onClick={() => setView('progress')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-green-400 to-emerald-500 hover:shadow-green-400/40 hover:scale-105",
                         isMounted ? "opacity-100 translate-y-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', left: '0', transitionDelay: '400ms' }}
                >
                    <BarChart3 className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Progress</span>
                </button>

                <button
                    onClick={() => setView('workout')}
                    className={cn(
                        bubbleCommonClass,
                        "absolute bg-gradient-to-br from-blue-500 to-cyan-500 hover:shadow-blue-400/40 hover:scale-105",
                        isMounted ? "opacity-100 translate-y-4" : "opacity-0"
                    )}
                    style={{ bottom: '0', right: '0', transitionDelay: '600ms' }}
                >
                    <Dumbbell className="h-10 w-10" />
                    <span className="font-bold mt-2 text-sm">Workout</span>
                </button>
            </div>
        </div>
    );
};


// --- Main Page Component ---
function ActivityPage() {
  const [view, setView] = useState<View>("hub");

  const PageContent = () => {
    switch (view) {
      case "workout":
        return <WorkoutLog />;
      case "progress":
        return <ProgressTracker />;
      default:
        return <HubView setView={setView} />;
    }
  };

  return (
     <div className="p-4 md:p-8 space-y-8 pb-24">
        {view !== 'hub' && (
            <Button variant="outline" onClick={() => setView('hub')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activity Hub
            </Button>
        )}
        <PageContent />
     </div>
  )
}

export default function WorkoutPage() {
    return <ActivityPage />
}
    
    

