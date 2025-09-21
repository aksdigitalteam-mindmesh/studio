
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bell, User, ChevronDown, ChevronLeft, ChevronRight, Calendar, MoreVertical, Plus, ShoppingCart, Dumbbell, PlayCircle, X, Scale } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format, addDays, subDays, isToday, isYesterday, startOfDay, isSameDay } from 'date-fns';
import { WaterGlass } from "@/components/water-glass";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
  { name: 'Breakfast', recommended: '492 - 737', image: 'https://placehold.co/100x100.png', hint: 'juice glass' },
  { name: 'Lunch', recommended: '737 - 983', image: 'https://placehold.co/100x100.png', hint: 'salad bowl' },
  { name: 'Dinner', recommended: '737 - 983', image: 'https://placehold.co/100x100.png', hint: 'spaghetti plate' },
  { name: 'Snacks', recommended: '0 - 246', image: 'https://placehold.co/100x100.png', hint: 'banana fruit' },
];

const CALORIE_GOAL = 2458;
const WORKOUT_BURN_CALORIES = 350; // default calories burned per workout
const MACRO_GOALS = {
    carbs: 307,
    protein: 123,
    fat: 82,
};
const WATER_GOAL = 8;
const WATER_STORAGE_KEY = "waterLog"; // Changed from waterGlasses


export default function DashboardPage() {
    const [waterLog, setWaterLog] = useState<WaterLog>({});
    const [isClient, setIsClient] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [eatenCalories, setEatenCalories] = useState(0);
    const [burnedCalories, setBurnedCalories] = useState(0);
    const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });
    const user = { displayName: 'Fitness Pro', photoURL: 'https://placehold.co/128x128.png' };


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

        const handleStorageChange = () => {
            loadDataForDate(currentDate);
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
    
    const menuItems = [
      { href: "/dashboard/calories", bg: "bg-orange-100", image: "https://placehold.co/100x100.png", hint: "juice glass", label: "Breakfast" },
      { href: "/dashboard/calories", bg: "bg-blue-100", image: "https://placehold.co/100x100.png", hint: "salad bowl", label: "Lunch" },
      { href: "/dashboard/calories", bg: "bg-red-100", image: "https://placehold.co/100x100.png", hint: "spaghetti plate", label: "Dinner" },
      { href: "/dashboard/calories", bg: "bg-yellow-100", image: "https://placehold.co/100x100.png", hint: "banana fruit", label: "Snacks" },
      { href: "/dashboard/workout", bg: "bg-purple-100", image: "https://placehold.co/100x100.png", hint: "person lifting weights", label: "Exercise" },
      { href: "/dashboard/calories", bg: "bg-sky-100", image: "https://placehold.co/100x100.png", hint: "water glass", label: "Water" },
    ];

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
      {/* Header */}
       <div className="relative text-primary-foreground bg-gradient-to-r from-primary to-green-400">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/0" />
        <div className="relative z-10">
          <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white/50">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
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

          {/* Main Content */}
          <main className="flex-1">
            {/* Calorie Circle */}
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-400/0 to-primary/0">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <defs>
                      <linearGradient id="eatenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: "rgb(255, 0, 0)"}} />
                          <stop offset="50%" style={{stopColor: "rgb(255, 165, 0)"}} />
                          <stop offset="100%" style={{stopColor: "rgb(0, 0, 255)"}} />
                      </linearGradient>
                      <linearGradient id="burnedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: "rgb(0, 0, 255)"}} />
                          <stop offset="100%" style={{stopColor: "rgb(128, 0, 128)"}} />
                      </linearGradient>
                  </defs>
                  <path
                    className="text-white/30"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2"
                  />
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
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{Math.round(caloriesLeft)}</span>
                  <span className="text-sm tracking-wider">KCAL LEFT</span>
                </div>
              </div>
              <div className="flex justify-between w-full max-w-sm mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{eatenCalories}</p>
                  <p className="text-xs">EATEN</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{burnedCalories}</p>
                  <p className="text-xs">BURNED</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Button variant="link" className="text-white">
                    SEE STATS <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            </main>
        </div>
      </div>
      <div className="bg-background rounded-t-3xl -mt-6 p-4 space-y-4">
            {/* Today's Workout */}
            {workoutPlan && todaysWorkout ? (
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
                          <li className="text-sm text-muted-foreground">Rest day!</li>
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
                        <CardTitle className="flex items-center gap-2"><Dumbbell className="text-primary"/> Generate a Workout</CardTitle>
                        <CardDescription>No workout plan generated yet. Go to the programs tab to create one!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/programs">Generate AI Workout</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Macros Section */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-semibold">Carbs</p>
                            <Progress value={carbProgress} indicatorClassName="bg-green-500" className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">{Math.round(macros.carbs)}/{MACRO_GOALS.carbs}g</p>
                        </div>
                        <div>
                            <p className="font-semibold">Protein</p>
                            <Progress value={proteinProgress} indicatorClassName="bg-blue-500" className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">{Math.round(macros.protein)}/{MACRO_GOALS.protein}g</p>
                        </div>
                        <div>
                            <p className="font-semibold">Fat</p>
                            <Progress value={fatProgress} indicatorClassName="bg-red-500" className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">{Math.round(macros.fat)}/{MACRO_GOALS.fat}g</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Date Navigator */}
            <div className="flex items-center justify-between p-2">
                <Button variant="ghost" size="icon" onClick={prevDay}><ChevronLeft /></Button>
                <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="h-5 w-5" />
                    <span>{formattedDate}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={nextDay}><ChevronRight /></Button>
            </div>

            {/* Water Tracker */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Water</CardTitle>
                        {isClient && <CardDescription>{`${filledGlasses} / ${WATER_GOAL} glasses`}</CardDescription>}
                    </div>
                    <Button variant="ghost" size="icon"><MoreVertical /></Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-4 gap-2">
                    {isClient && waterGlassesForDate.map((filled, index) => (
                        <WaterGlass key={index} filled={filled} onClick={() => handleWaterClick(index)} />
                    ))}
                    </div>
                </CardContent>
            </Card>

             {/* Meal Logging Section */}
            <div className="space-y-2">
              {mealCategories.map((cat) => (
                  <Link href="/dashboard/calories" key={cat.name}>
                      <Card className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100">
                                  <Image src={cat.image} alt={cat.name} width={64} height={64} data-ai-hint={cat.hint} className="rounded-full" />
                              </div>
                              <div className="flex-grow">
                                  <h3 className="font-bold">{cat.name}</h3>
                                  <p className="text-sm text-muted-foreground">Recommended {cat.recommended} kcal</p>
                              </div>
                              <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
                                  <Plus className="text-muted-foreground" />
                              </Button>
                          </CardContent>
                      </Card>
                  </Link>
              ))}
            </div>

        </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button 
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg animate-pulse-shadow"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <X className="w-8 h-8"/> : <Plus className="w-8 h-8"/>}
        </Button>
      </div>

       {/* Plus Button Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 z-40 flex flex-col justify-center items-center p-8 pt-20">
            <Card className="w-full max-w-md bg-green-100/50 border-green-200">
                <CardContent className="flex items-center gap-4 p-4">
                    <Scale className="h-8 w-8 text-primary"/>
                    <div>
                        <h3 className="font-bold">Compare products</h3>
                        <p className="text-sm text-muted-foreground">to get nutritional recommendations</p>
                    </div>
                </CardContent>
            </Card>
            
            <div className="relative w-[300px] h-[300px] mt-12">
              {menuItems.map((item, index) => {
                 const angle = (index / 6) * 2 * Math.PI - Math.PI / 2;
                 const x = Math.cos(angle) * 120;
                 const y = Math.sin(angle) * 120;
                return (
                 <Link 
                    href={item.href} 
                    key={item.label}
                    className="absolute flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:scale-110"
                    style={{
                      top: `calc(50% + ${y}px - 50px)`,
                      left: `calc(50% + ${x}px - 50px)`,
                    }}
                    onClick={() => setIsMenuOpen(false)}>
                    <div className={cn("w-24 h-24 rounded-full flex items-center justify-center", item.bg)}>
                        <Image src={item.image} alt={item.label} width={100} height={100} className="rounded-full" data-ai-hint={item.hint} />
                    </div>
                    <p className="font-semibold">{item.label}</p>
                </Link>
                )
              })}
            </div>
        </div>
      )}
    </div>
  );

    