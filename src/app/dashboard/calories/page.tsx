
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Trash2 } from "lucide-react";
import { isToday, startOfToday } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Meal {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  caloriesPerUnit: number;
  totalCalories: number;
  date: string;
}

const STORAGE_KEY = "dailyMeals";

export default function CaloriesPage() {
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [mealName, setMealName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pieces");
  const [caloriesPerUnit, setCaloriesPerUnit] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedMeals = localStorage.getItem(STORAGE_KEY);
        setAllMeals(savedMeals ? JSON.parse(savedMeals) : []);
    }
  }, []);

  useEffect(() => {
    if (allMeals.length > 0 || localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allMeals));
    }
  }, [allMeals]);

  const todaysMeals = allMeals.filter(meal => isToday(new Date(meal.date)));

  const totalCalories = todaysMeals.reduce((acc, meal) => acc + meal.totalCalories, 0);
  const calorieGoal = 2000;
  const progress = (totalCalories / calorieGoal) * 100;

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealName.trim() && quantity && caloriesPerUnit) {
      const numQuantity = parseFloat(quantity);
      const numCalories = parseInt(caloriesPerUnit);
      const newMeal: Meal = {
        id: Date.now(),
        name: mealName.trim(),
        quantity: numQuantity,
        unit: unit,
        caloriesPerUnit: numCalories,
        totalCalories: numQuantity * numCalories,
        date: startOfToday().toISOString(),
      };
      setAllMeals([...allMeals, newMeal]);
      setMealName("");
      setQuantity("1");
      setCaloriesPerUnit("");
    }
  };

  const handleDeleteMeal = (id: number) => {
    setAllMeals(allMeals.filter(meal => meal.id !== id));
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
          <form onSubmit={handleAddMeal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <Input
              placeholder="Meal or food item"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              className="sm:col-span-2 lg:col-span-2"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
             <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pieces">pieces</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="liters">liters</SelectItem>
                </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Calories per unit"
              value={caloriesPerUnit}
              onChange={(e) => setCaloriesPerUnit(e.target.value)}
              required
            />
            <Button type="submit" className="w-full sm:col-span-2 lg:col-span-5">
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
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Total Calories</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysMeals.length > 0 ? (
                todaysMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="font-medium">{meal.name}</TableCell>
                    <TableCell className="text-muted-foreground">{meal.quantity} {meal.unit} &times; {meal.caloriesPerUnit} kcal</TableCell>
                    <TableCell className="text-right font-semibold">{meal.totalCalories} kcal</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMeal(meal.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
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
