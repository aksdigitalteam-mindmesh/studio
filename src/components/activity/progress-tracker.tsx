
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompletedWorkouts } from "@/lib/workout-log-actions";
import { format } from "date-fns";
import { Dumbbell, Flame, PlusCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ProgressTracker() {
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

    