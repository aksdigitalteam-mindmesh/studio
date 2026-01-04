
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

export const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  gender: z.enum(["male", "female", "other"]),
  medicalConditions: z.string().optional(),
  workoutDuration: z.coerce.number().min(10, "Duration must be at least 10 minutes.").max(180, "Duration must be 180 minutes or less."),
  workoutDaysPerWeek: z.coerce.number().min(1, "You must work out at least 1 day a week.").max(7, "You can work out a maximum of 7 days a week."),
  age: z.coerce.number().min(12, "You must be at least 12 years old.").max(120, "Age seems too high."),
  height: z.coerce.number().min(100, "Height must be at least 100 cm.").max(300, "Height must be 300cm or less."),
  weight: z.coerce.number().min(30, "Weight must be at least 30 kg.").max(500, "Weight must be 500kg or less."),
  targetWeight: z.coerce.number().min(30, "Target weight must be at least 30 kg.").max(500, "Target weight must be 500kg or less."),
  fitnessGoal: z.enum(["weight-loss", "build-muscle", "endurance"], {
    required_error: "You need to select a fitness goal.",
  }),
  intensity: z.enum(["low", "medium", "high"], {
      required_error: "You need to select an intensity level.",
  }),
}).refine(data => {
    if (data.fitnessGoal === 'weight-loss') {
        return data.targetWeight < data.weight;
    }
    return true;
}, {
    message: "Target weight must be less than current weight for weight loss.",
    path: ["targetWeight"],
}).refine(data => {
    if (data.fitnessGoal === 'build-muscle') {
        return data.targetWeight > data.weight;
    }
    return true;
}, {
    message: "Target weight must be greater than current weight to build muscle.",
    path: ["targetWeight"],
});

export const onboardingSchema = z.object({
    age: z.coerce.number().min(12, "You must be at least 12 years old.").max(120, "Age seems too high."),
    height: z.coerce.number().min(100, "Height must be at least 100 cm.").max(300, "Height must be 300cm or less."),
    weight: z.coerce.number().min(30, "Weight must be at least 30 kg.").max(500, "Weight must be 500kg or less."),
    fitnessGoal: z.enum(["weight-loss", "build-muscle", "endurance"], {
      required_error: "You need to select a fitness goal.",
    }),
    intensity: z.enum(["beginner", "intermediate", "advanced"], {
        required_error: "You need to select an intensity level.",
    }),
});

    