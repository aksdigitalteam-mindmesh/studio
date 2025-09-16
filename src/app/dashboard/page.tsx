"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bell, User, ChevronDown, ChevronLeft, ChevronRight, Calendar, MoreVertical, Plus, ShoppingCart, Dumbbell, PlayCircle, X, Scale } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import Image from "next/image";

const WaterGlassComponent = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-16 h-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-t-lg overflow-hidden flex items-center justify-center group">
    {/* Water fill */}
    <div 
      className={cn(
        "absolute bottom-0 w-full bg-blue-400 transition-all duration-500 ease-in-out",
        filled ? "h-full" : "h-0"
      )} 
    />
    {/* Glass outline and shine effect */}
    <div className="absolute inset-0 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-t-lg " />
    <div className="absolute top-2 left-2 w-1 h-[calc(100%-1rem)] bg-white/20 rounded-full transform -rotate-12 opacity-50" />
    <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" />
    
    {/* Plus icon when empty */}
    {!filled && <Plus className="h-6 w-6 text-gray-400 group-hover:text-gray-500 transition-colors" />}
  </button>
);

const WaterGlass = memo(WaterGlassComponent);


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

const mealCategories = [
  { name: 'Breakfast', recommended: '492 - 737', image: 'https://placehold.co/100x100.png', hint: 'juice glass' },
  { name: 'Lunch', recommended: '737 - 983', image: 'https://placehold.co/100x100.png', hint: 'salad bowl' },
  { name: 'Dinner', recommended: '737 - 983', image: 'https://placehold.co/100x100.png', hint: 'spaghetti plate' },
  { name: 'Snacks', recommended: '0 - 246', image: 'https://placehold.co/100x100.png', hint: 'banana fruit' },
];

export default function DashboardPage() {
    const [waterGlasses, setWaterGlasses] = useState(() => {
        if (typeof window === 'undefined') return Array(8).fill(false);
        const savedWater = localStorage.getItem('waterGlasses');
        return savedWater ? JSON.parse(savedWater) : Array(8).fill(false);
    });
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedPlan = localStorage.getItem('latestWorkoutPlan');
        if (storedPlan) {
            setWorkoutPlan(JSON.parse(storedPlan));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('waterGlasses', JSON.stringify(waterGlasses));
    }, [waterGlasses]);

    const handleWaterClick = (index: number) => {
        const newGlasses = [...waterGlasses];
        // If the user clicks a glass, fill all glasses up to that one, or empty all glasses from that one on
        const isFilling = !newGlasses[index];
        for (let i = 0; i < newGlasses.length; i++) {
          if (isFilling) {
            if (i <= index) newGlasses[i] = true;
          } else {
             if (i >= index) newGlasses[i] = false;
          }
        }
        setWaterGlasses(newGlasses);
    };

    const filledGlasses = waterGlasses.filter(Boolean).length;
    
    const menuItems = [
      { href: "/dashboard/calories", bg: "bg-orange-100", image: "https://placehold.co/100x100.png", hint: "juice glass", label: "Breakfast" },
      { href: "/dashboard/calories", bg: "bg-blue-100", image: "https://placehold.co/100x100.png", hint: "salad bowl", label: "Lunch" },
      { href: "/dashboard/calories", bg: "bg-red-100", image: "https://placehold.co/100x100.png", hint: "spaghetti plate", label: "Dinner" },
      { href: "/dashboard/calories", bg: "bg-yellow-100", image: "https://placehold.co/100x100.png", hint: "banana fruit", label: "Snacks" },
      { href: "/dashboard/programs", bg: "bg-purple-100", image: "https://placehold.co/100x100.png", hint: "person lifting weights", label: "Exercise" },
      { href: "/dashboard/water", bg: "bg-sky-100", image: "https://placehold.co/100x100.png", hint: "water glass", label: "Water" },
    ];


  return (
    <div className="w-full flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-green-400 text-primary-foreground">
        <Button className="bg-accent hover:bg-accent/90 rounded-full text-accent-foreground font-bold">SAVE 50%</Button>
        <h1 className="text-2xl font-bold">Lifesum</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/profile">
            <User className="cursor-pointer" />
          </Link>
          <Bell />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Calorie Circle */}
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-400 to-primary text-primary-foreground">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-white/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">2458</span>
              <span className="text-sm tracking-wider">KCAL LEFT</span>
            </div>
          </div>
          <div className="flex justify-between w-full max-w-sm mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs">EATEN</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs">BURNED</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Button variant="link" className="text-white">
                SEE STATS <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-t-3xl -mt-6 p-4 space-y-4">
            {/* Today's Workout */}
            {workoutPlan ? (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Dumbbell className="text-primary"/> Today's Workout</CardTitle>
                    <CardDescription>{workoutPlan.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {workoutPlan.exercises.slice(0, 3).map(ex => (
                            <li key={ex.name} className="text-sm text-muted-foreground flex items-center justify-between">
                                <span>{ex.name} ({ex.sets} x {ex.reps})</span>
                                <PlayCircle className="h-5 w-5 text-primary/50" />
                            </li>
                        ))}
                         {workoutPlan.exercises.length > 3 && (
                             <li className="text-sm text-muted-foreground">...and {workoutPlan.exercises.length - 3} more</li>
                         )}
                    </ul>
                    <Button asChild variant="secondary" className="w-full mt-4">
                        <Link href="/dashboard/programs">View Full Workout</Link>
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
                            <Progress value={0} className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">0/307g</p>
                        </div>
                        <div>
                            <p className="font-semibold">Protein</p>
                            <Progress value={0} className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">0/123g</p>
                        </div>
                        <div>
                            <p className="font-semibold">Fat</p>
                            <Progress value={0} className="mt-2 h-1"/>
                            <p className="text-sm text-muted-foreground mt-1">0/82g</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Date Navigator */}
            <div className="flex items-center justify-between p-2">
                <Button variant="ghost" size="icon"><ChevronLeft /></Button>
                <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="h-5 w-5" />
                    <span>TODAY, 31 JUL</span>
                </div>
                <Button variant="ghost" size="icon"><ChevronRight /></Button>
            </div>

            {/* Water Tracker */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Water</CardTitle>
                        <CardDescription>{filledGlasses} / {waterGlasses.length} glasses</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon"><MoreVertical /></Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-4 gap-2">
                    {waterGlasses.map((filled, index) => (
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
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button 
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg"
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
}
