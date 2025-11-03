
'use server';

/**
 * @fileOverview Generates a personalized 7-day diet plan for paid members.
 *
 * - generateDietPlan - A function that generates a diet plan based on user input.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user, e.g., lose weight, gain muscle.'),
  calorieTarget: z.number().describe('The target daily calorie intake.'),
  macroRatio: z
    .string()
    .describe(
      'The desired macro ratio (protein, carbs, fat) in percentage, e.g., 30% protein, 40% carbs, 30% fat.'
    ),
  cuisine: z
    .string()
    .optional()
    .describe('The preferred cuisine, e.g., Italian, Mexican, Indian.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe(
      'Any dietary restrictions or preferences, e.g., vegetarian, vegan, gluten-free.'
    ),
  foodPreferences: z
    .string()
    .optional()
    .describe('The food preferences of the user, e.g., likes chicken, dislikes fish.'),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const MealSchema = z.object({
  name: z.string().describe("Name of the meal (e.g., Breakfast, Lunch, Dinner, Snack)."),
  description: z.string().describe("A short, appealing description of the meal."),
  recipe: z.object({
    ingredients: z.array(z.string()).describe("List of ingredients for the recipe."),
    instructions: z.array(z.string()).describe("Step-by-step cooking instructions."),
  }),
  calories: z.number().describe("Estimated calories for this meal."),
  macros: z.object({
    protein: z.string().describe("Protein content in grams (e.g., '30g')."),
    carbs: z.string().describe("Carbohydrate content in grams (e.g., '40g')."),
    fat: z.string().describe("Fat content in grams (e.g., '15g')."),
  }),
});

const DailyPlanSchema = z.object({
  day: z.number().describe("The day number of the plan (1-7)."),
  meals: z.array(MealSchema).describe('A list of meals for the day, including detailed recipes and nutritional info.'),
  dailyTotals: z.object({
        calories: z.number().describe('Total estimated calories for the day.'),
        macros: z.object({
          protein: z.string().describe("Total protein for the day in grams."),
          carbs: z.string().describe("Total carbs for the day in grams."),
          fat: z.string().describe("Total fat for the day in grams."),
        }),
    }),
});

const GenerateDietPlanOutputSchema = z.object({
    title: z.string().describe("A catchy and motivating title for the 7-day diet plan."),
    summary: z.string().describe("A brief, encouraging summary of the diet plan and its benefits."),
    dailyPlans: z.array(DailyPlanSchema).describe("A list of daily meal plans for 7 days."),
});

export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

export async function generateDietPlan(
  input: GenerateDietPlanInput
): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a certified nutritionist and expert recipe creator. A paid member wants to generate a personalized 7-day diet plan with calorie and macro recommendations to optimize their nutrition for their fitness goals.

  Fitness Goals: {{{fitnessGoals}}}
  Calorie Target: ~{{{calorieTarget}}} calories per day
  Macro Ratio: {{{macroRatio}}}
  Cuisine Preference: {{#if cuisine}}{{{cuisine}}}{{else}}None{{/if}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Food Preferences: {{{foodPreferences}}}

  Generate a detailed 7-day diet plan. For each day, provide:
  1. A full day of meals (Breakfast, Lunch, Dinner, and a Snack).
  2. For each meal, provide a short description, a detailed recipe (ingredients and instructions), and an estimation of calories and macros (protein, carbs, fat).
  3. A daily summary of total calories and macros.

  The entire diet plan MUST align with the total daily calorie target and macro ratio. It also must respect all dietary restrictions, food preferences, and cuisine styles.
  Create a catchy title and a brief, encouraging summary for the overall 7-day plan. Ensure the meals are varied and interesting across the 7 days.
`,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
