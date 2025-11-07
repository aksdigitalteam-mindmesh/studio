
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompletedWorkouts } from "@/lib/workout-log-actions";
import { format } from "date-fns";
import { Dumbbell, Flame, PlusCircle, Ruler } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

type CompletedWorkout = {
  title:string;
  date: string;
};

const initialWeightData = [
  { date: "2024-05-01", weight: 80.0 },
  { date: "2024-05-08", weight: 79.5 },
  { date: "2024-05-15", weight: 78.7 },
  { date: "2024-05-22", weight: 77.8 },
  { date: "2024-05-29", weight: 77.1 },
];
const WEIGHT_STORAGE_KEY = 'weightData';
const HEIGHT_STORAGE_KEY = 'userHeight';

const weightChartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const bmiChartConfig = {
  bmi: {
    label: "BMI",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-500" };
    if (bmi < 24.9) return { category: "Normal", color: "bg-green-500" };
    if (bmi < 29.9) return { category: "Overweight", color: "bg-yellow-500" };
    return { category: "Obese", color: "bg-red-500" };
}

export function ProgressTracker() {
  const [weightData, setWeightData] = useState(initialWeightData);
  const [height, setHeight] = useState(175); // default height in cm
  const [targetWeight, setTargetWeight] = useState(70);
  const [currentWeight, setCurrentWeight] = useState("");
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const savedWeight = localStorage.getItem(WEIGHT_STORAGE_KEY);
    const savedHeight = localStorage.getItem(HEIGHT_STORAGE_KEY);
    setWeightData(savedWeight ? JSON.parse(savedWeight) : initialWeightData);
    setHeight(savedHeight ? JSON.parse(savedHeight) : 175);
    setCompletedWorkouts(getCompletedWorkouts());
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(weightData));
      localStorage.setItem(HEIGHT_STORAGE_KEY, JSON.stringify(height));
    }
  }, [weightData, height, isClient]);

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

  const latestWeight = weightData.length > 0 ? weightData[weightData.length-1].weight : 0;
  const bmi = latestWeight > 0 && height > 0 ? (latestWeight / ((height / 100) ** 2)) : 0;
  const { category: bmiCategory, color: bmiColor } = getBmiCategory(bmi);
  const bmiChartData = [
      { name: 'Underweight', range: 18.5, fill: 'var(--color-underweight)' },
      { name: 'Normal', range: 24.9, fill: 'var(--color-normal)' },
      { name: 'Overweight', range: 29.9, fill: 'var(--color-overweight)' },
      { name: 'Obese', range: 40, fill: 'var(--color-obese)' },
  ];

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Current: {isClient && latestWeight > 0 ? latestWeight : 'N/A'}kg | Target: {targetWeight}kg</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weightChartConfig} className="h-64 w-full">
            <LineChart data={weightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            <CardTitle>Body Mass Index (BMI)</CardTitle>
             <CardDescription>
                A measure of body fat based on height and weight.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isClient && bmi > 0 ? (
                 <div className="space-y-4">
                    <div className="flex items-baseline justify-center gap-2">
                         <p className="text-4xl font-bold">{bmi.toFixed(1)}</p>
                         <Badge className={bmiColor}>{bmiCategory}</Badge>
                    </div>
                    <div className="w-full h-4 flex rounded-full overflow-hidden">
                        <div className="bg-blue-500" style={{ width: '46.25%' }}></div>
                        <div className="bg-green-500" style={{ width: '16%' }}></div>
                        <div className="bg-yellow-500" style={{ width: '12.5%' }}></div>
                        <div className="bg-red-500" style={{ width: '25.25%' }}></div>
                    </div>
                    <div className="relative h-4">
                       {bmi > 0 && <div className="absolute top-[-10px] h-6 w-px bg-foreground" style={{ left: `${Math.min((bmi / 40) * 100, 100)}%` }}></div>}
                    </div>
                 </div>
            ) : (
                <p className="text-muted-foreground text-center">Enter your height and weight to calculate your BMI.</p>
            )}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="lg:col-span-1">
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
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Your Height</CardTitle></CardHeader>
          <CardContent>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="height">Your Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <Button type="submit" className="w-full"><Ruler className="mr-2 h-4 w-4" /> Set Height</Button>
            </form>
          </CardContent>
        </Card>
         <Card className="lg:col-span-1">
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
