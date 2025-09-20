
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WaterGlass } from "@/components/water-glass";
import { Loader2, MoreVertical } from "lucide-react";

const WATER_STORAGE_KEY = "waterGlasses";

export default function WaterPage() {
  const [waterGlasses, setWaterGlasses] = useState<boolean[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Function to load data from localStorage
  const loadWaterData = () => {
    const savedWater = localStorage.getItem(WATER_STORAGE_KEY);
    if (savedWater) {
        try {
            setWaterGlasses(JSON.parse(savedWater));
        } catch {
            setWaterGlasses(Array(8).fill(false));
        }
    } else {
        setWaterGlasses(Array(8).fill(false));
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadWaterData();

    // Listen for storage changes to sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === WATER_STORAGE_KEY) {
            loadWaterData();
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (isClient) {
        localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(waterGlasses));
    }
  }, [waterGlasses, isClient]);

  const handleWaterClick = (index: number) => {
    const newGlasses = [...waterGlasses];
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

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
       <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Water Tracker</h1>
        <p className="text-muted-foreground">Stay hydrated throughout the day.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <CardTitle className="text-lg">Water</CardTitle>
                <CardDescription>{filledGlasses} / {waterGlasses.length} glasses</CardDescription>
            </div>
            <Button variant="ghost" size="icon"><MoreVertical /></Button>
        </CardHeader>
        <CardContent>
            {!isClient ? (
                 <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                {waterGlasses.map((filled, index) => (
                    <WaterGlass key={index} filled={filled} onClick={() => handleWaterClick(index)} />
                ))}
                </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hydration Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>💧 Carry a reusable water bottle with you throughout the day.</p>
          <p>💧 Set reminders on your phone or computer to drink water.</p>
          <p>💧 Add a flavor enhancer like lemon, lime, or mint to make water more appealing.</p>
          <p>💧 Eat water-rich foods like fruits and vegetables.</p>
        </CardContent>
      </Card>
    </div>
  );
}
