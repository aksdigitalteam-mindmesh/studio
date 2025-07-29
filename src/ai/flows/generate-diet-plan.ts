'use server';

/**
 * @fileOverview Generates a personalized diet plan for paid members.
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

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('A personalized diet plan with meal suggestions.'),
  calorieRecommendation: z.number().describe('Recommended daily calorie intake.'),
  macroRecommendation: z
    .string()
    .describe('Recommended macro breakdown (protein, carbs, fat).'),
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
  prompt: `You are a certified nutritionist and personal trainer. A paid member wants to generate a personalized diet plan with calorie and macro recommendations to optimize their nutrition for their fitness goals.

  Fitness Goals: {{{fitnessGoals}}}
  Calorie Target: {{{calorieTarget}}} calories
  Macro Ratio: {{{macroRatio}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Food Preferences: {{{foodPreferences}}}

  Generate a detailed diet plan including specific meals for the user.
  The diet plan MUST align with the calorie target, macro ratio, dietary restrictions and food preferences.
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
