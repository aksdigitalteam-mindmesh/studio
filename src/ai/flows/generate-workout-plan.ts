'use server';

/**
 * @fileOverview Workout plan generation flow for paid members.
 *
 * - generateWorkoutPlan - A function that generates a personalized workout plan.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateExerciseImage} from '@/ai/flows/generate-exercise-image';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('Specific fitness goals, e.g., lose weight, build muscle, improve endurance.'),
  intensity: z
    .enum(['low', 'medium', 'high'])
    .describe('Desired workout intensity level.'),
  duration: z
    .number()
    .describe('Preferred workout duration in minutes.'),
  bodyFocus: z
    .string()
    .optional()
    .describe('Optional: Specific body parts to focus on, e.g., legs, core, arms.'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  sets: z.string().describe('The number of sets to perform.'),
  reps: z.string().describe('The number of repetitions per set.'),
  rest: z.string().describe('The rest time between sets.'),
  imageUrl: z.string().url().describe('URL of an image showing the exercise.'),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  title: z.string().describe("A catchy and motivating title for the workout plan."),
  description: z.string().describe("A brief, encouraging description of the workout's focus."),
  exercises: z.array(ExerciseSchema).describe('A list of personalized exercises.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const workoutPrompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.string(),
          reps: z.string(),
          rest: z.string(),
        })
      ),
    }),
  },
  prompt: `You are a certified personal trainer. Generate a personalized workout plan based on the user's fitness goals, desired intensity, workout duration, and any specific body parts they want to focus on.

Fitness Goals: {{{fitnessGoals}}}
Intensity: {{{intensity}}}
Duration: {{{duration}}} minutes
Body Focus: {{#if bodyFocus}}{{{bodyFocus}}}{{else}}No specific body focus{{/if}}

Provide a catchy title, a short description, and a list of specific exercises with sets, reps, and rest times. Do not include images.`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await workoutPrompt(input);
    if (!output) {
      throw new Error('Failed to generate workout plan');
    }

    const imagePromises = output.exercises.map(exercise =>
      generateExerciseImage({exerciseName: exercise.name})
    );
    const images = await Promise.all(imagePromises);

    const exercisesWithImages = output.exercises.map((exercise, index) => ({
      ...exercise,
      imageUrl: images[index].imageUrl,
    }));

    return {
      title: output.title,
      description: output.description,
      exercises: exercisesWithImages,
    };
  }
);
