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
