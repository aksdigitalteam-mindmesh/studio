
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bell, User, ChevronLeft, ChevronRight, Calendar, Dumbbell, PlayCircle, Plus } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { format, addDays, subDays, isToday, isYesterday, isSameDay } from 'date-fns';
import { WaterGlass } from "@/components/water-glass";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/hooks/use-auth";


type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
};

type DailyWorkout = {
    day: number;
    title: string;
    exercises?: Exercise[];
};

type WorkoutPlan = {
  title: string;
  description: string;
  weeklySchedule: DailyWorkout[];
};

type CompletedWorkout = {
  title: string;
  date: string;
};

type Meal = {
  id: number;
  name:string;
  calories: number;
  date: string; // ISO string
  macros?: {
    protein: string;
    carbs: string;
    fat: string;
  };
};

type WaterLog = {
    [date: string]: boolean[]; // date is 'yyyy-MM-dd'
};


const mealCategories = [
  { name: 'Breakfast', recommended: '492 - 737', image: 'https://picsum.photos/seed/bf/100/100', hint: 'juice glass' },
  { name: 'Lunch', recommended: '737 - 983', image: 'https://picsum.photos/seed/lu/100/100', hint: 'salad bowl' },
  { name: 'Dinner', recommended: '737 - 983', image: 'https://picsum.photos/seed/di/100/100', hint: 'spaghetti plate' },
  { name: 'Snacks', recommended: '0 - 246', image: 'https://picsum.photos/seed/sn/100/100', hint: 'banana fruit' },
];

const CALORIE_GOAL = 2458;
const WORKOUT_BURN_CALORIES = 350; // default calories burned per workout
const MACRO_GOALS = {
    carbs: 307,
    protein: 123,
    fat: 82,
};
const WATER_GOAL = 8;
const WATER_STORAGE_KEY = "waterLog";


export default function DashboardPage() {
    const { user } = useAuthContext();
    const [waterLog, setWaterLog] = useState<WaterLog>({});
    const [isClient, setIsClient] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [eatenCalories, setEatenCalories] = useState(0);
    const [burnedCalories, setBurnedCalories] = useState(0);
    const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });


    const loadDataForDate = useCallback((date: Date) => {
        if (typeof window === 'undefined') return;
        
        const dateKey = format(date, 'yyyy-MM-dd');

        // --- Calorie & Macro Calculation ---
        const savedMeals = localStorage.getItem("dailyMeals");
        const allMeals: Meal[] = savedMeals ? JSON.parse(savedMeals) : [];
        const relevantMeals = allMeals.filter(meal => isSameDay(new Date(meal.date), date));
        
        let totalEaten = 0;
        const totalMacros = { carbs: 0, protein: 0, fat: 0 };

        relevantMeals.forEach(meal => {
            totalEaten += meal.calories;
             if (meal.macros) {
                totalMacros.protein += parseFloat(meal.macros.protein) || 0;
                totalMacros.carbs += parseFloat(meal.macros.carbs) || 0;
                totalMacros.fat += parseFloat(meal.macros.fat) || 0;
            } else {
                // Fallback for older meal data without macros
                totalMacros.protein += 15;
                totalMacros.carbs += 20;
                totalMacros.fat += 10;
            }
        });
        setEatenCalories(totalEaten);
        setMacros(totalMacros);

        // --- Burned Calories ---
        const savedWorkouts = localStorage.getItem("completedWorkouts");
        const completedWorkouts: CompletedWorkout[] = savedWorkouts ? JSON.parse(savedWorkouts) : [];
        const dateWorkouts = completedWorkouts.filter(workout => isSameDay(new Date(workout.date), date));
        setBurnedCalories(dateWorkouts.length * WORKOUT_BURN_CALORIES);

        // --- Hydration ---
        const savedWaterLog = localStorage.getItem(WATER_STORAGE_KEY);
        const log: WaterLog = savedWaterLog ? JSON.parse(savedWaterLog) : {};
        setWaterLog(log);

    }, []);

    useEffect(() => {
        setIsClient(true);
        loadDataForDate(currentDate);

        const storedPlan = localStorage.getItem('latestWorkoutPlan');
        if (storedPlan) {
            setWorkoutPlan(JSON.parse(storedPlan));
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'dailyMeals' || event.key === 'completedWorkouts' || event.key === WATER_STORAGE_KEY) {
                loadDataForDate(currentDate);
            }
            if (event.key === 'latestWorkoutPlan') {
                const updatedPlan = localStorage.getItem('latestWorkoutPlan');
                 if (updatedPlan) {
                    setWorkoutPlan(JSON.parse(updatedPlan));
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [currentDate, loadDataForDate]);
    
    const handleWaterClick = (index: number) => {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const newLog = { ...waterLog };
        const currentGlasses = newLog[dateKey] || Array(WATER_GOAL).fill(false);
        const newGlasses = [...currentGlasses];
        
        const isFilling = !newGlasses[index];
        for (let i = 0; i < newGlasses.length; i++) {
          if (isFilling) {
            if (i <= index) newGlasses[i] = true;
          } else {
             if (i >= index) newGlasses[i] = false;
          }
        }
        newLog[dateKey] = newGlasses;
        setWaterLog(newLog);
        localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(newLog));
    };

    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const waterGlassesForDate = waterLog[dateKey] || Array(WATER_GOAL).fill(false);
    const filledGlasses = waterGlassesForDate.filter(Boolean).length;

    const nextDay = () => setCurrentDate(addDays(currentDate, 1));
    const prevDay = () => setCurrentDate(subDays(currentDate, 1));
    
    const formattedDate = (() => {
      if (isToday(currentDate)) return `TODAY, ${format(currentDate, 'dd MMM').toUpperCase()}`;
      if (isYesterday(currentDate)) return `YESTERDAY, ${format(currentDate, 'dd MMM').toUpperCase()}`;
      return format(currentDate, 'EEEE, dd MMM').toUpperCase();
    })();

    const caloriesLeft = CALORIE_GOAL - eatenCalories + burnedCalories;
    const eatenProgress = (eatenCalories / CALORIE_GOAL) * 100;
    const burnedProgress = (burnedCalories / CALORIE_GOAL) * 100;

    const carbProgress = (macros.carbs / MACRO_GOALS.carbs) * 100;
    const proteinProgress = (macros.protein / MACRO_GOALS.protein) * 100;
    const fatProgress = (macros.fat / MACRO_GOALS.fat) * 100;
    
    const dayOfWeekForWorkout = currentDate.getDay(); // Sunday - 0, Monday - 1, ...
    const currentDayOfWeek = dayOfWeekForWorkout === 0 ? 7 : dayOfWeekForWorkout; // Adjust to 1-7 (Mon-Sun)
    const todaysWorkout = workoutPlan?.weeklySchedule?.find(day => day.day === currentDayOfWeek);

  return (
    <div className="w-full flex flex-col font-sans pb-24">
       <div className="relative text-primary-foreground bg-gradient-to-r from-primary to-green-400">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/0" />
        <div className="relative z-10">
          <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white/50">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} data-ai-hint="person portrait" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs">Welcome back,</p>
                    <p className="font-bold">{user?.displayName?.split(' ')[0] || 'User'}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/profile">
                <Button variant="ghost" size="icon"><User className="cursor-pointer" /></Button>
              </Link>
              <Button variant="ghost" size="icon"><Bell /></Button>
            </div>
          </header>

          <main className="flex-1">
            <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-green-400/0 to-primary/0">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <defs>
                      <linearGradient id="eatenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: "rgb(255, 165, 0)"}} />
                          <stop offset="100%" style={{stopColor: "rgb(255, 0, 0)"}} />
                      </linearGradient>
                      <linearGradient id="burnedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: "rgb(0, 255, 255)"}} />
                          <stop offset="100%" style={{stopColor: "rgb(0, 0, 255)"}} />
                      </linearGradient>
                  </defs>
                  <path
                    className="text-white/30"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2"
                  />
                   {isClient && <>
                     <path
                        stroke="url(#eatenGradient)"
                        strokeDasharray={`${eatenProgress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                      <path
                        stroke="url(#burnedGradient)"
                        strokeDasharray={`${burnedProgress}, 100`}
                        d="M18 5.0845 a 12.9155 12.9155 0 0 1 0 25.831 a 12.9155 12.9155 0 0 1 0 -25.831"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform="rotate(180 18 18)"
                      />
                   </>}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold">{isClient ? Math.round(caloriesLeft) : '...'}</span>
                  <span className="text-sm tracking-wider">KCAL LEFT</span>
                </div>
              </div>
              <div className="flex justify-between w-full max-w-sm mt-4">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold">{isClient ? eatenCalories : '...'}</p>
                  <p className="text-xs">EATEN</p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold">{isClient ? burnedCalories : '...'}</p>
                  <p className="text-xs">BURNED</p>
                </div>
              </div>
            </div>
            </main>
        </div>
      </div>
      <div className="bg-background rounded-t-3xl -mt-6 p-4 md:p-6 space-y-4">
            {isClient && (todaysWorkout ? (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Dumbbell className="text-primary"/> Today's Workout</CardTitle>
                    <CardDescription>{todaysWorkout.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {todaysWorkout.exercises && todaysWorkout.exercises.length > 0 ? (
                          todaysWorkout.exercises.slice(0, 3).map(ex => (
                            <li key={ex.name} className="text-sm text-muted-foreground flex items-center justify-between">
                                <span>{ex.name} ({ex.sets} x {ex.reps})</span>
                                <PlayCircle className="h-5 w-5 text-primary/50" />
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">Rest day! Time to recover.</li>
                        )}
                         {todaysWorkout.exercises && todaysWorkout.exercises.length > 3 && (
                             <li className="text-sm text-muted-foreground">...and {todaysWorkout.exercises.length - 3} more</li>
                         )}
                    </ul>
                    <Button asChild variant="secondary" className="w-full mt-4">
                        <Link href="/dashboard/workout?view=workout">View Full Workout</Link>
                    </Button>
                </CardContent>
              </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Dumbbell className="text-primary"/> Create a Workout</CardTitle>
                        <CardDescription>No workout plan found. Generate one with your AI coach!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/programs?tab=workout">Generate AI Workout</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-semibold">Carbs</p>
                            {isClient && <Progress value={carbProgress} indicatorClassName="bg-green-500" className="mt-2 h-1"/>}
                            <p className="text-sm text-muted-foreground mt-1">{isClient ? `${Math.round(macros.carbs)}/${MACRO_GOALS.carbs}g` : '...'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Protein</p>
                            {isClient && <Progress value={proteinProgress} indicatorClassName="bg-blue-500" className="mt-2 h-1"/>}
                            <p className="text-sm text-muted-foreground mt-1">{isClient ? `${Math.round(macros.protein)}/${MACRO_GOALS.protein}g` : '...'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Fat</p>
                            {isClient && <Progress value={fatProgress} indicatorClassName="bg-red-500" className="mt-2 h-1"/>}
                            <p className="text-sm text-muted-foreground mt-1">{isClient ? `${Math.round(macros.fat)}/${MACRO_GOALS.fat}g` : '...'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between p-2">
                <Button variant="ghost" size="icon" onClick={prevDay}><ChevronLeft /></Button>
                <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="h-5 w-5" />
                    <span>{isClient ? formattedDate : '...'}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={nextDay}><ChevronRight /></Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Water Intake</CardTitle>
                    {isClient && <CardDescription>{`${filledGlasses} / ${WATER_GOAL} glasses`}</CardDescription>}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-4 gap-4">
                    {isClient && waterGlassesForDate.map((filled, index) => (
                        <WaterGlass key={index} filled={filled} onClick={() => handleWaterClick(index)} />
                    ))}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="px-2 font-semibold">Log Your Meals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealCategories.map((cat) => (
                    <Link href="/dashboard/calories" key={cat.name}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Image src={cat.image} alt={cat.name} width={64} height={64} data-ai-hint={cat.hint} className="rounded-full bg-muted" />
                                <div className="flex-grow">
                                    <h3 className="font-bold">{cat.name}</h3>
                                    <p className="text-sm text-muted-foreground">Recommended {cat.recommended} kcal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full bg-muted text-muted-foreground">
                                    <Plus />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
              </div>
            </div>
        </div>
    </div>
  );
}

    

    