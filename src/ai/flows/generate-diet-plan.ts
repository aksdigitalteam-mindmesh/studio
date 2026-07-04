'use server';

/**
 * @fileOverview Generates a personalized 7-day diet plan using Gemini.
 */

import { z } from 'zod';

const GenerateDietPlanInputSchema = z.object({
  fitnessGoals: z.string().describe('The fitness goals of the user.'),
  calorieTarget: z.number().describe('The target daily calorie intake.'),
  macroRatio: z.string().describe('The desired macro ratio (protein, carbs, fat).'),
  cuisine: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  foodPreferences: z.string().optional(),
  medicalConditions: z.string().optional(),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const MealSchema = z.object({
  name: z.string(),
  description: z.string(),
  recipe: z.object({
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  }),
  calories: z.number(),
  macros: z.object({
    protein: z.string(),
    carbs: z.string(),
    fat: z.string(),
  }),
});

const DailyPlanSchema = z.object({
  day: z.number(),
  meals: z.array(MealSchema),
  dailyTotals: z.object({
    calories: z.number(),
    macros: z.object({
      protein: z.string(),
      carbs: z.string(),
      fat: z.string(),
    }),
  }),
});

const GenerateDietPlanOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  dailyPlans: z.array(DailyPlanSchema),
});
export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

async function callGemini(prompt: string): Promise<GenerateDietPlanOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!jsonString) throw new Error("Empty response from Gemini");

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", jsonString);
    throw new Error("Invalid JSON response from AI");
  }
}

export async function generateDietPlan(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> {
  const prompt = `You are a certified nutritionist. Generate a detailed 7-day diet plan for a user with these details:
  - Fitness Goals: ${input.fitnessGoals}
  - Calorie Target: ${input.calorieTarget}
  - Macro Ratio: ${input.macroRatio}
  - Cuisine: ${input.cuisine || 'Any'}
  - Dietary Restrictions: ${input.dietaryRestrictions || 'None'}
  - Food Preferences: ${input.foodPreferences || 'None'}
  - Medical Conditions: ${input.medicalConditions || 'None'}

  Return ONLY a valid JSON object matching this schema:
  {
    "title": "String",
    "summary": "String",
    "dailyPlans": [
      {
        "day": number,
        "meals": [
          {
            "name": "Breakfast/Lunch/Dinner/Snack",
            "description": "String",
            "recipe": { "ingredients": ["String"], "instructions": ["String"] },
            "calories": number,
            "macros": { "protein": "String", "carbs": "String", "fat": "String" }
          }
        ],
        "dailyTotals": { "calories": number, "macros": { "protein": "String", "carbs": "String", "fat": "String" } }
      }
    ]
  }`;

  return callGemini(prompt);
}