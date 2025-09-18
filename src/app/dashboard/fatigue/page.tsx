
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MuscleFatigueDiagram } from "@/components/muscle-fatigue-diagram";
import type { Muscle } from "@/components/muscle-fatigue-diagram";
import { Hand, Eye, Loader2, BrainCircuit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


type FatigueData = Partial<Record<Muscle, number>>;

const FATIGUE_STORAGE_KEY = 'muscleFatigueData';
const GENDER_STORAGE_KEY = 'userGender';

const initialFatigueData: FatigueData = {
  shoulders: 35,
  chest: 55,
  biceps: 60,
  abs: 45,
  quads: 75,
  triceps: 15,
  back: 25,
  glutes: 85,
  hamstrings: 20,
  calves: 10,
};

const muscleGroupDetails: Record<Muscle, { name: string; lastTrained: string }> = {
    shoulders: { name: 'Shoulders', lastTrained: 'Upper Body Day - 2 days ago' },
    chest: { name: 'Chest', lastTrained: 'Push Day - 1 day ago' },
    biceps: { name: 'Biceps', lastTrained: 'Pull Day - 3 days ago' },
    abs: { name: 'Abs', lastTrained: 'Core Blast - 1 day ago' },
    quads: { name: 'Quads', lastTrained: 'Leg Day - 4 days ago' },
    back: { name: 'Back', lastTrained: 'Pull Day - 3 days ago' },
    triceps: { name: 'Triceps', lastTrained: 'Push Day - 1 day ago' },
    glutes: { name: 'Glutes', lastTrained: 'Leg Day - 4 days ago' },
    hamstrings: { name: 'Hamstrings', lastTrained: 'Leg Day - 4 days ago' },
    calves: { name: 'Calves', lastTrained: 'Full Body - 5 days ago' },
};

const fatigueLegend = [
    { color: "bg-red-500", label: "80-100%: Max fatigue, rest needed" },
    { color: "bg-orange-500", label: "50-79%: High fatigue, consider lighter activity" },
    { color: "bg-yellow-400", label: "30-49%: Moderate fatigue, ready for some work" },
    { color: "bg-blue-500", label: "10-29%: Low fatigue, ready to train" },
    { color: "bg-muted", label: "0-9%: Fully recovered" },
];

export default function FatigueTrackerPage() {
  const [fatigueData, setFatigueData] = useState<FatigueData>({});
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isClient, setIsClient] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side
    setIsClient(true);

    const savedFatigueData = localStorage.getItem(FATIGUE_STORAGE_KEY);
    if (savedFatigueData) {
        setFatigueData(JSON.parse(savedFatigueData));
    } else {
        setFatigueData(initialFatigueData);
    }
    
    const savedGender = localStorage.getItem(GENDER_STORAGE_KEY) as 'male' | 'female' | null;
    if(savedGender) {
        setGender(savedGender);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem(FATIGUE_STORAGE_KEY, JSON.stringify(fatigueData));
    }
  }, [fatigueData, isClient]);

  const highFatigueMuscle = isClient ? Object.entries(fatigueData).find(([, value]) => value > 70) : undefined;
  
  const handleMuscleClick = (muscle: Muscle) => {
    setSelectedMuscle(muscle);
  };
  
  const handlePopoverClose = (open: boolean) => {
    if(!open) {
        setSelectedMuscle(null);
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-red-500";
    if (value >= 50) return "bg-orange-500";
    if (value >= 30) return "bg-yellow-400";
    if (value >= 10) return "bg-blue-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Fatigue Tracker</h1>
        <p className="text-muted-foreground">Visualize your muscle recovery and train smarter.</p>
      </div>
      
      {isClient && highFatigueMuscle && (
        <Alert variant="destructive">
          <Hand className="h-5 w-5"/>
          <AlertTitle>High Fatigue Warning!</AlertTitle>
          <AlertDescription>
            Your {muscleGroupDetails[highFatigueMuscle[0] as Muscle].name} are at {highFatigueMuscle[1]}% fatigue. Consider resting this muscle group to prevent injury.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Muscle Recovery Status</CardTitle>
                    <CardDescription>Tap a muscle for details. Body type from profile.</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent>
            {!isClient ? (
             <div className="flex justify-center items-center h-full min-h-[450px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
            ) : (
             <Popover open={!!selectedMuscle} onOpenChange={handlePopoverClose}>
                 <PopoverTrigger asChild>
                    <div>
                        <MuscleFatigueDiagram 
                            fatiguedMuscles={fatigueData} 
                            gender={gender}
                            onMuscleClick={handleMuscleClick}
                            selectedMuscle={selectedMuscle}
                        />
                    </div>
                 </PopoverTrigger>
                 {selectedMuscle && (
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{muscleGroupDetails[selectedMuscle].name}</h4>
                                <p className="text-sm text-muted-foreground">
                                    Current fatigue level and recovery suggestions.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Fatigue</Label>
                                    <Progress value={fatigueData[selectedMuscle]} indicatorClassName={getProgressColor(fatigueData[selectedMuscle] || 0)} className="col-span-2 h-2" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Last Trained</Label>
                                    <span className="col-span-2 text-sm text-muted-foreground">{muscleGroupDetails[selectedMuscle].lastTrained}</span>
                                </div>
                            </div>
                            <Button asChild size="sm">
                               <Link href="/dashboard/programs"><BrainCircuit className="mr-2 h-4 w-4" /> AI Recovery Suggestion</Link>
                            </Button>
                        </div>
                    </PopoverContent>
                 )}
             </Popover>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Fatigue Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {fatigueLegend.map(item => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Detailed Muscle Groups</CardTitle>
                    <CardDescription>Breakdown of fatigue for each muscle group.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {isClient ? (Object.entries(fatigueData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([muscle, value]) => (
                    <div key={muscle} className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{muscleGroupDetails[muscle as Muscle].name}</span>
                        <span className="text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} indicatorClassName={getProgressColor(value || 0)} />
                    </div>
                ))) : (
                    <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    