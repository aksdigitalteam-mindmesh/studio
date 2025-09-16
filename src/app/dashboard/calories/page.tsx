"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Trash2 } from "lucide-react";

interface Meal {
  id: number;
  name: string;
  calories: number;
}

const STORAGE_KEY = "dailyMeals";

export default function CaloriesPage() {
  const [meals, setMeals] = useState<Meal[]>(() => {
    if (typeof window === 'undefined') return [];
    const savedMeals = localStorage.getItem(STORAGE_KEY);
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  }, [meals]);

  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const calorieGoal = 2000;
  const progress = (totalCalories / calorieGoal) * 100;

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealName.trim() && calories) {
      const newMeal: Meal = {
        id: Date.now(),
        name: mealName.trim(),
        calories: parseInt(calories),
      };
      setMeals([...meals, newMeal]);
      setMealName("");
      setCalories("");
    }
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Calorie Tracker</h1>
        <p className="text-muted-foreground">Log your daily meals to stay on track.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
          <CardDescription>You've consumed {totalCalories} out of {calorieGoal} kcal today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Log a Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMeal} className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Meal or food item"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="Calories (kcal)"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              className="sm:w-48"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="font-medium">{meal.name}</TableCell>
                    <TableCell className="text-right">{meal.calories} kcal</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMeal(meal.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No meals logged yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
