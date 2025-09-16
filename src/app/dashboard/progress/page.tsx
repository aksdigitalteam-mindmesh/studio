
"use client";

import { useState, Suspense, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { UploadCloud, PlusCircle, Lock } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { MuscleFatigueDiagram } from "@/components/muscle-fatigue-diagram";

const initialWeightData = [
  { date: "2024-05-01", weight: 80.0, photo: "https://placehold.co/600x400.png" },
  { date: "2024-05-08", weight: 79.5, photo: "https://placehold.co/600x400.png" },
  { date: "2024-05-15", weight: 78.7, photo: "https://placehold.co/600x400.png" },
  { date: "2024-05-22", weight: 77.8, photo: "https://placehold.co/600x400.png" },
  { date: "2024-05-29", weight: 77.1, photo: "https://placehold.co/600x400.png" },
  { date: "2024-06-05", weight: 76.3, photo: "https://placehold.co/600x400.png" },
  { date: "2024-06-12", weight: 75.2, photo: null },
];

const WEIGHT_STORAGE_KEY = 'weightData';

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


function ProgressPageContent() {
  const searchParams = useSearchParams();
  const isUpgraded = searchParams.get('upgraded') === 'true';
  const [isPremium, setIsPremium] = useState(isUpgraded);

   useEffect(() => {
    const premiumStatus = isUpgraded || localStorage.getItem('isPremium') === 'true';
    setIsPremium(premiumStatus);
    if (isUpgraded) {
        localStorage.setItem('isPremium', 'true');
    }
  }, [isUpgraded]);

  const [weightData, setWeightData] = useState(() => {
    if (typeof window === 'undefined') return initialWeightData;
    const savedData = localStorage.getItem(WEIGHT_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : initialWeightData;
  });

  const [targetWeight, setTargetWeight] = useState(70);
  const [currentWeight, setCurrentWeight] = useState("");

  useEffect(() => {
    localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(weightData));
  }, [weightData]);
  

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight) {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(currentWeight),
        photo: null,
      };
      setWeightData([...weightData, newEntry]);
      setCurrentWeight("");
    }
  };
  
  const fatiguedMuscles = {
    chest: 0.8,
    biceps: 0.6,
    abs: 0.4,
    quads: 0.9,
    shoulders: 0.5,
  };

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Your Progress</h1>
        <p className="text-muted-foreground">Track your weight and see your transformation.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Log Your Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Today's Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 75.2"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Weight</CardTitle>
          </CardHeader>
          <CardContent>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Set Target (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                />
              </div>
              <Button type="submit" className="w-full">Set Target</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Chart</CardTitle>
          <CardDescription>Current Weight: {weightData.length > 0 ? weightData[weightData.length-1].weight : 'N/A'}kg | Target: {targetWeight}kg</CardDescription>
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

      <Card className="relative">
        {!isPremium && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center rounded-lg">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">Unlock Muscle Fatigue Analysis</h2>
              <p className="text-muted-foreground mb-6">Upgrade to Premium to visualize your muscle recovery and optimize your training schedule.</p>
              <Button asChild>
                <Link href="/dashboard/subscription">Upgrade to Premium</Link>
              </Button>
          </div>
        )}
        <div className={!isPremium ? 'blur-sm pointer-events-none' : ''}>
          <CardHeader>
            <CardTitle>Muscle Fatigue</CardTitle>
            <CardDescription>Visualization of your recently worked muscle groups.</CardDescription>
          </CardHeader>
          <CardContent>
              <MuscleFatigueDiagram fatiguedMuscles={fatiguedMuscles} />
          </CardContent>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Progress Pictures</CardTitle>
          <CardDescription>A visual timeline of your transformation.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Upload Picture</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          {weightData.slice().reverse().map((entry) => (
            entry.photo && (
              <div key={entry.date} className="group relative aspect-square">
                <Image src={entry.photo} alt={`Progress photo from ${entry.date}`} fill objectFit="cover" className="rounded-lg" data-ai-hint="person fitness" />
                <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-2">
                  <p className="text-sm font-semibold text-white">{entry.date} - {entry.weight}kg</p>
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgressPageContent />
    </Suspense>
  );
}
