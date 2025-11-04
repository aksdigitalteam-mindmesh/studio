
import { z } from "zod";

export const workoutPlanSchema = z.object({
  fitnessGoals: z.string().min(3, "Fitness goals must be at least 3 characters long."),
  intensity: z.enum(["low", "medium", "high"]),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes.").max(180, "Duration must be 180 minutes or less."),
  daysPerWeek: z.coerce.number().min(1, "You must work out at least 1 day a week.").max(7, "You can work out a maximum of 7 days a week."),
  equipment: z.enum(["with", "without"]),
  bodyFocus: z.string().optional(),
});

export const dietPlanSchema = z.object({
  fitnessGoals: z.string().min(3, "Fitness goals must be at least 3 characters long."),
  calorieTarget: z.coerce.number().min(1000, "Calorie target must be at least 1000.").max(10000, "Calorie target seems too high."),
  macroRatio: z.string().min(3, "Please provide a macro ratio (e.g., 40% protein, 40% carbs, 20% fat)."),
  cuisine: z.string().optional(),
  medicalConditions: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  foodPreferences: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});
