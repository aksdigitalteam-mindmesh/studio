
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompletedWorkouts } from "@/lib/workout-log-actions";
import { format } from "date-fns";
import { Dumbbell, Flame, PlusCircle, Ruler, Save } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type CompletedWorkout = {
  title:string;
  date: string;
};

type WeightEntry = {
    date: string;
    weight: number;
};

const WEIGHT_STORAGE_KEY = 'weightData';

const weightChartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
};

const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-500" };
    if (bmi < 24.9) return { category: "Normal", color: "bg-green-500" };
    if (bmi < 29.9) return { category: "Overweight", color: "bg-yellow-500" };
    return { category: "Obese", color: "bg-red-500" };
}

export function ProgressTracker() {
  const { user, profile, updateUserProfile, refreshProfile } = useAuthContext();
  const { toast } = useToast();

  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [height, setHeight] = useState(profile?.height || 0);
  const [currentWeight, setCurrentWeight] = useState("");
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const savedWeight = localStorage.getItem(WEIGHT_STORAGE_KEY);
    setWeightData(savedWeight ? JSON.parse(savedWeight) : []);
    setCompletedWorkouts(getCompletedWorkouts());
  }, []);
  
  useEffect(() => {
    if (profile) {
      setHeight(profile.height || 0);
      if (profile.weight) {
        // Check if there's already an entry for today
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysEntry = weightData.find(d => d.date === todayStr);
        if (!todaysEntry) {
            setWeightData(prevData => {
              const newData = [...prevData, { date: todayStr, weight: profile.weight! }];
              localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(newData));
              return newData;
            });
        }
      }
    }
  }, [profile, weightData]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight && user) {
      const newWeight = parseFloat(currentWeight);
      const todayStr = new Date().toISOString().split('T')[0];
      
      setIsUpdating(true);
      updateUserProfile(user.uid, { weight: newWeight }).then(error => {
          setIsUpdating(false);
          if (error) {
              toast({ variant: 'destructive', title: 'Update failed', description: error });
          } else {
              toast({ title: 'Weight updated!' });
              
              const existingEntryIndex = weightData.findIndex(d => d.date === todayStr);
              let newData = [...weightData];
              if (existingEntryIndex > -1) {
                  newData[existingEntryIndex] = { date: todayStr, weight: newWeight };
              } else {
                  newData.push({ date: todayStr, weight: newWeight });
              }
              setWeightData(newData);
              localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(newData));
              setCurrentWeight("");
              refreshProfile(); // Refresh context
          }
      });
    }
  };

  const handleSetHeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (height && user) {
        setIsUpdating(true);
        updateUserProfile(user.uid, { height }).then(error => {
            setIsUpdating(false);
            if(error) {
                 toast({ variant: 'destructive', title: 'Update failed', description: error });
            } else {
                toast({ title: 'Height updated!' });
                refreshProfile();
            }
        });
    }
  };

  const latestWeight = weightData.length > 0 ? weightData[weightData.length-1].weight : profile?.weight || 0;
  const bmi = latestWeight > 0 && height > 0 ? (latestWeight / ((height / 100) ** 2)) : 0;
  const { category: bmiCategory, color: bmiColor } = getBmiCategory(bmi);
  const targetWeight = 70; // Placeholder

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Current: {isClient && latestWeight > 0 ? `${latestWeight}kg` : 'N/A'} | Target: {targetWeight}kg</CardDescription>
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

      <div className="grid gap-4 md:grid-cols-2">
         <Card>
          <CardHeader><CardTitle>Log Your Weight</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Today's Weight (kg)</Label>
                <Input id="currentWeight" type="number" step="0.1" placeholder="e.g., 75.2" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} 
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Update Your Height</CardTitle></CardHeader>
          <CardContent>
             <form className="space-y-4" onSubmit={handleSetHeight}>
              <div className="space-y-2">
                <Label htmlFor="height">Your Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} 
                Set Height
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
