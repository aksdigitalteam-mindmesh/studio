
"use server";

import { z } from "zod";
import { generateWorkoutPlan as genWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateDietPlan as genDietPlan } from "@/ai/flows/generate-diet-plan";
import { dietPlanSchema, workoutPlanSchema } from "./schemas";
import { generateRecoveryTips as genRecoveryTips } from "@/ai/flows/generate-recovery-tips";
import { enrichWorkoutPlanWithGifs } from "./exercise-preview-service";

export async function generateWorkoutPlanAction(values: z.infer<typeof workoutPlanSchema> & { medicalConditions?: string }) {
  try {
    const validatedFields = workoutPlanSchema.extend({ medicalConditions: z.string().optional() }).safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input provided." };
    }
    
    // Step 1: Generate workout plan with AI (includes exercise IDs now)
    const aiGeneratedPlan = await genWorkoutPlan(validatedFields.data);
    
    // Step 2: Enrich with exercise GIFs using IDs
    const enrichedPlan = await enrichWorkoutPlanWithGifs(aiGeneratedPlan);
    
    return { data: enrichedPlan };
  } catch (error) {
    console.error("Workout plan generation failed:", error);
    return { error: "An unexpected error occurred while generating the workout plan. Please try again later." };
  }
}

// Keep other actions unchanged
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
