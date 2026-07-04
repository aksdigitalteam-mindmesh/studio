
"use server";

import { z } from "zod";
import { generateDietPlan as genDietPlan } from "@/ai/flows/generate-diet-plan";
import { dietPlanSchema, workoutPlanSchema } from "./schemas";
import { generateRecoveryTips as genRecoveryTips } from "@/ai/flows/generate-recovery-tips";
import { enrichWorkoutPlanWithImages } from "./exercise-preview-service";
import { getExerciseId } from "./exercise-database";
import { buildLocalWorkoutPlan } from "./workout-builder";

export async function generateWorkoutPlanAction(values: z.infer<typeof workoutPlanSchema> & { medicalConditions?: string }) {
  try {
    console.log('Starting local workout generation...');
    
    const validatedFields = workoutPlanSchema.extend({ medicalConditions: z.string().optional() }).safeParse(values);
    if (!validatedFields.success) {
      console.error('Validation failed:', validatedFields.error);
      return { error: "Invalid input provided." };
    }
    
    // Step 1: Generate workout plan locally using the inbuilt directory
    const plan = buildLocalWorkoutPlan(validatedFields.data);
    
    // Step 2: Add exercise IDs for GIF matching
    if (plan.weeklySchedule) {
      for (const day of plan.weeklySchedule) {
        if (day.exercises) {
          for (const exercise of day.exercises) {
            const exerciseId = getExerciseId(exercise.name);
            (exercise as any).exerciseId = exerciseId;
          }
        }
      }
    }
    
    // Step 3: Enrich with exercise Images from ExerciseDB (requires API key)
    console.log('Fetching exercise images...');
    const enrichedPlan = await enrichWorkoutPlanWithImages(plan);
    console.log('Workout plan complete');
    
    return { data: enrichedPlan };
  } catch (error: any) {
    console.error("Workout plan generation failed:", error);
    return { error: error?.message || "An unexpected error occurred while generating the workout plan." };
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

export async function generateRecoveryTipsAction(fatiguedMuscles: string[]) {
    try {
        if (!fatiguedMuscles || fatiguedMuscles.length === 0) {
            return { error: "No fatigued muscles provided." };
        }
        const result = await genRecoveryTips({ fatiguedMuscles });
        return { data: result };
    } catch (error) {
        console.error("Recovery tips generation failed:", error);
        return { error: "An unexpected error occurred while generating recovery tips." };
    }
}
