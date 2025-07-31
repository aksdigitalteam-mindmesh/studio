"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { Bell, User, ChevronDown, ChevronLeft, ChevronRight, Calendar, MoreVertical, Plus, ShoppingCart } from "lucide-react";
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

const WaterGlass = ({ filled, onClick }: { filled: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="relative w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
    {filled && <div className="absolute bottom-0 w-full h-full bg-blue-400" />}
    <div className="absolute top-0 w-full h-full border-2 border-gray-300 dark:border-gray-600 rounded-t-lg" />
    {!filled && <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />}
  </button>
);


export default function DashboardPage() {
    const [waterGlasses, setWaterGlasses] = useState(Array(8).fill(false));
    const affiliateTag = "your-amazon-tag-20"; // Replace with your actual Amazon affiliate tag

    const handleWaterClick = (index: number) => {
        const newGlasses = [...waterGlasses];
        newGlasses[index] = !newGlasses[index];
        setWaterGlasses(newGlasses);
    };

    const filledGlasses = waterGlasses.filter(Boolean).length;

  return (
    <div className="w-full flex flex-col font-sans pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-b from-green-400 to-green-500 text-white">
        <Button className="bg-orange-400 hover:bg-orange-500 rounded-full text-white font-bold">SAVE 50%</Button>
        <h1 className="text-2xl font-bold">Lifesum</h1>
        <div className="flex items-center gap-4">
          <User />
          <Bell />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Calorie Circle */}
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-500 to-green-600 text-white">
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
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white rounded-full">
                <a href={`https://www.amazon.com/s?k=healthy+ingredients&tag=${affiliateTag}`} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4"/> Buy Ingredients
                </a>
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-t-3xl -mt-6 p-4 space-y-4">
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
                        <CardDescription>{filledGlasses} / {waterGlasses.length}</CardDescription>
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
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        <Button className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg">
            <Plus className="w-8 h-8"/>
        </Button>
      </div>
    </div>
  );
}
