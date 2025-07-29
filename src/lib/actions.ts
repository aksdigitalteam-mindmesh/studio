"use server";

import { z } from "zod";
import { generateWorkoutPlan as genWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateDietPlan as genDietPlan } from "@/ai/flows/generate-diet-plan";

export const workoutPlanSchema = z.object({
  fitnessGoals: z.string().min(3, "Fitness goals must be at least 3 characters long."),
  intensity: z.enum(["low", "medium", "high"]),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes.").max(180, "Duration must be 180 minutes or less."),
  bodyFocus: z.string().optional(),
});

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

export const dietPlanSchema = z.object({
  fitnessGoals: z.string().min(3, "Fitness goals must be at least 3 characters long."),
  calorieTarget: z.coerce.number().min(1000, "Calorie target must be at least 1000.").max(10000, "Calorie target seems too high."),
  macroRatio: z.string().min(3, "Please provide a macro ratio (e.g., 40% protein, 40% carbs, 20% fat)."),
  dietaryRestrictions: z.string().optional(),
  foodPreferences: z.string().optional(),
});


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
