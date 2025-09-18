
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MuscleFatigueDiagram } from "@/components/muscle-fatigue-diagram";
import type { Muscle } from "@/components/muscle-fatigue-diagram";
import { Hand, Eye, PersonStanding, VenetianMask } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";


type FatigueData = Partial<Record<Muscle, number>>;

const FATIGUE_STORAGE_KEY = 'muscleFatigueData';

// Simulated initial data matching the visual style of the example
const initialFatigueData: FatigueData = {
  shoulders: 35,
  chest: 55,
  biceps: 55,
  abs: 55,
  quads: 75,
  triceps: 15,
  back: 25,
  glutes: 5,
  hamstrings: 5,
  calves: 5,
};

const muscleGroupNames: Record<Muscle, string> = {
    shoulders: 'Shoulders',
    chest: 'Chest',
    biceps: 'Biceps',
    abs: 'Abs',
    quads: 'Quads',
    back: 'Back',
    triceps: 'Triceps',
    glutes: 'Glutes',
    hamstrings: 'Hamstrings',
    calves: 'Calves'
};

const fatigueLegend = [
    { color: "bg-red-500", label: "80-100%: Max fatigue, rest needed", className: "bg-red-500"},
    { color: "bg-orange-500", label: "50-79%: High fatigue, consider lighter activity", className: "bg-orange-500"},
    { color: "bg-yellow-400", label: "30-49%: Moderate fatigue, ready for some work", className: "bg-yellow-400"},
    { color: "bg-blue-500", label: "10-29%: Low fatigue, ready to train", className: "bg-blue-500"},
    { color: "bg-muted", label: "0-9%: Fully recovered", className: "bg-muted"},
];

export default function FatigueTrackerPage() {
  const [fatigueData, setFatigueData] = useState<FatigueData>(initialFatigueData);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem(FATIGUE_STORAGE_KEY);
    if (savedData) {
        setFatigueData(JSON.parse(savedData));
    } else {
        setFatigueData(initialFatigueData);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem(FATIGUE_STORAGE_KEY, JSON.stringify(fatigueData));
    }
  }, [fatigueData, isClient]);
  
  const highFatigueMuscle = isClient ? Object.entries(fatigueData).find(([, value]) => value > 70) : Object.entries(initialFatigueData).find(([, value]) => value > 70);

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
      
      {highFatigueMuscle && (
        <Alert variant="destructive">
          <Hand className="h-5 w-5"/>
          <AlertTitle>High Fatigue Warning!</AlertTitle>
          <AlertDescription>
            Your {muscleGroupNames[highFatigueMuscle[0] as Muscle]} are at {highFatigueMuscle[1]}% fatigue. Consider resting this muscle group to prevent injury.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Muscle Recovery Status</CardTitle>
            <CardDescription>A visual representation of your muscle fatigue levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
               <ToggleGroup type="single" value={gender} onValueChange={(value) => {if(value) setGender(value as 'male' | 'female')}} aria-label="Select gender diagram">
                <ToggleGroupItem value="male" aria-label="Male diagram">
                  <PersonStanding className="h-4 w-4 mr-2" />
                  Male
                </ToggleGroupItem>
                <ToggleGroupItem value="female" aria-label="Female diagram">
                  <PersonStanding className="h-4 w-4 mr-2" />
                  Female
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <MuscleFatigueDiagram fatiguedMuscles={fatigueData} gender={gender} />
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
                            <div className={`h-4 w-4 rounded-full ${item.className}`}></div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                  <CardTitle>Recovery Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/dashboard/programs">
                            <Eye className="mr-2 h-4 w-4" />
                            View Suggested Recovery Workouts
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Muscle Groups</CardTitle>
          <CardDescription>Breakdown of fatigue levels for each muscle group.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(fatigueData)
            .sort(([, a], [, b]) => b - a)
            .map(([muscle, value]) => (
            <div key={muscle} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{muscleGroupNames[muscle as Muscle]}</span>
                <span className="text-muted-foreground">{value}%</span>
              </div>
              <Progress value={value} indicatorClassName={getProgressColor(value)} />
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
