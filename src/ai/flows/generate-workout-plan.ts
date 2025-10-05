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
import { generateExerciseMedia } from '@/ai/flows/generate-exercise-media';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('Specific fitness goals, e.g., lose weight, build muscle, improve endurance.'),
  intensity: z
    .enum(['low', 'medium', 'high'])
    .describe('Desired workout intensity level.'),
  duration: z
    .number()
    .describe('Preferred workout duration in minutes per session.'),
  equipment: z
    .enum(['with', 'without'])
    .describe('Whether the user has access to gym equipment.'),
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
  videoUrl: z.string().describe('URL of an video showing the exercise.'),
  muscleGroups: z.array(z.string()).describe("A list of the primary muscle groups targeted by the exercise (e.g., ['chest', 'triceps', 'shoulders']). Use one of 'chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings', 'calves'"),
});

const DailyWorkoutSchema = z.object({
    day: z.number().describe("The day of the week for the workout (1-7)."),
    title: z.string().describe("A title for the day's workout (e.g., 'Upper Body Strength', 'Rest Day')."),
    description: z.string().describe("A brief description of the day's focus."),
    exercises: z.array(ExerciseSchema).optional().describe('A list of personalized exercises for the day. Empty for rest days.'),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  title: z.string().describe("A catchy and motivating title for the 7-day workout plan."),
  description: z.string().describe("A brief, encouraging description of the overall workout plan."),
  weeklySchedule: z.array(DailyWorkoutSchema).describe('A schedule of workouts for 7 days.'),
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
      weeklySchedule: z.array(z.object({
          day: z.number(),
          title: z.string(),
          description: z.string(),
          exercises: z.array(z.object({
              name: z.string(),
              sets: z.string(),
              reps: z.string(),
              rest: z.string(),
              muscleGroups: z.array(z.string()),
          })).optional(),
      })),
    }),
  },
  prompt: `You are a certified personal trainer. Generate a personalized 7-day workout plan based on the user's preferences. The plan must include exactly one rest day.

Fitness Goals: {{{fitnessGoals}}}
Intensity: {{{intensity}}}
Duration per session: {{{duration}}} minutes
Equipment: {{{equipment}}} equipment
Body Focus: {{#if bodyFocus}}{{{bodyFocus}}}{{else}}Full body{{/if}}

Provide a catchy title for the whole week, a short description, and a weekly schedule.
For each of the 7 days, provide a day number, a title for the day's workout, a short description, and a list of specific exercises with sets, reps, rest times, and the primary muscle groups targeted.
The muscle groups should be from this list: 'chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings', 'calves'.
If a day is a rest day, the 'exercises' array should be empty.
The exercises should be appropriate for the selected equipment availability. Do not include video URLs.`,
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
      throw new Error('Failed to generate workout plan text');
    }

    const scheduleWithVideos = [];

    for (const day of output.weeklySchedule) {
        if (day.exercises && day.exercises.length > 0) {
            const exercisesWithVideos = [];
            for (const exercise of day.exercises) {
                const videoResult = await generateExerciseMedia({ exerciseName: exercise.name });
                exercisesWithVideos.push({
                    ...exercise,
                    videoUrl: videoResult.videoUrl,
                });
            }
            scheduleWithVideos.push({ ...day, exercises: exercisesWithVideos });
        } else {
            scheduleWithVideos.push(day); // Rest day
        }
    }

    return {
      title: output.title,
      description: output.description,
      weeklySchedule: scheduleWithVideos,
    };
  }
);
