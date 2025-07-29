"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Minus, Plus } from "lucide-react";

const WATER_GOAL_ML = 2000;
const GLASS_SIZE_ML = 250;

export default function WaterPage() {
  const [waterIntake, setWaterIntake] = useState(1250);

  const glassesConsumed = Math.floor(waterIntake / GLASS_SIZE_ML);
  const progress = (waterIntake / WATER_GOAL_ML) * 100;

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Water Tracker</h1>
        <p className="text-muted-foreground">Stay hydrated throughout the day.</p>
      </div>

      <Card>
        <CardHeader className="items-center text-center">
          <Droplets className="h-12 w-12 text-primary" />
          <CardTitle className="text-4xl font-bold">{waterIntake} <span className="text-xl font-normal text-muted-foreground">ml</span></CardTitle>
          <CardDescription>Goal: {WATER_GOAL_ML} ml</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full max-w-sm">
            <div className="relative h-4 w-full rounded-full bg-secondary">
              <div
                className="absolute h-4 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress > 100 ? 100 : progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => addWater(250)}>
              <Plus className="mr-2 h-4 w-4" /> Add Glass (250ml)
            </Button>
            <Button variant="outline" size="lg" onClick={() => addWater(500)}>
             <Plus className="mr-2 h-4 w-4" /> Add Bottle (500ml)
            </Button>
          </div>
           <Button variant="ghost" size="sm" onClick={() => addWater(-250)}>
              <Minus className="mr-2 h-4 w-4" /> Remove a glass
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hydration Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-5 gap-2 sm:gap-4">
          {Array.from({ length: WATER_GOAL_ML / GLASS_SIZE_ML }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Droplets
                className={`h-10 w-10 transition-colors ${
                  i < glassesConsumed ? "text-primary fill-primary/20" : "text-muted-foreground/30"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                { (i + 1) * GLASS_SIZE_ML } ml
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
