
"use server";

import { z } from "zod";
import { generateWorkoutPlan as genWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateDietPlan as genDietPlan } from "@/ai/flows/generate-diet-plan";
import { dietPlanSchema, workoutPlanSchema } from "./schemas";


export async function generateWorkoutPlanAction(values: z.infer<typeof workoutPlanSchema>) {
  try {
    const validatedFields = workoutPlanSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input provided." };
    }
    const result = await genWorkoutPlan(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error("Workout plan generation failed:", error);
    return { error: "An unexpected error occurred while generating the workout plan. Please try again later." };
  }
}

export async function generateDietPlanAction(values: z.infer<typeof dietPlanSchema>) {
  try {
    const validatedFields = dietPlanSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input provided." };
    }
    const result = await genDietPlan(validatedFields.data);
    return { data: result };
  } catch (error) {
    console.error("Diet plan generation failed:", error);
    return { error: "An unexpected error occurred while generating the diet plan. Please try again later." };
  }
}


// These are client-side actions that interact with localStorage
const WORKOUT_LOG_STORAGE_KEY = 'completedWorkouts';

type CompletedWorkout = {
  title: string;
  date: string;
};

export function saveCompletedWorkoutAction(title: string) {
  if (typeof window === 'undefined') return;
  const newWorkout: CompletedWorkout = {
    title,
    date: new Date().toISOString(),
  };
  const existingWorkouts = getCompletedWorkouts();
  const updatedWorkouts = [...existingWorkouts, newWorkout];
  localStorage.setItem(WORKOUT_LOG_STORAGE_KEY, JSON.stringify(updatedWorkouts));
  // Dispatch a storage event to notify other tabs/windows
  window.dispatchEvent(new Event('storage'));
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  const log = localStorage.getItem(WORKOUT_LOG_STORAGE_KEY);
  return log ? JSON.parse(log) : [];
}
