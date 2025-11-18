
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
import { getExerciseId } from '@/lib/exercise-database';

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
  daysPerWeek: z
    .number()
    .describe('How many days per week the user can work out.'),
  equipment: z
    .enum(['with', 'without'])
    .describe('Whether the user has access to gym equipment.'),
  bodyFocus: z
    .string()
    .optional()
    .describe('Optional: Specific body parts to focus on, e.g., legs, core, arms.'),
    medicalConditions: z
    .string()
    .optional()
    .describe('Any medical conditions to consider, e.g., diabetes, high blood pressure. Be extra cautious with recommendations.'),
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

const workoutPrompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a certified personal trainer. Generate a personalized 7-day workout plan based on the user's preferences.

Fitness Goals: {{{fitnessGoals}}}
Intensity: {{{intensity}}}
Duration per session: {{{duration}}} minutes
Days per week: {{{daysPerWeek}}}
Equipment: {{{equipment}}} equipment
Body Focus: {{#if bodyFocus}}{{{bodyFocus}}}{{else}}Full body{{/if}}
Medical Conditions: {{#if medicalConditions}}{{{medicalConditions}}}{{else}}None{{/if}}

If the user has specified any medical conditions, you MUST create a safe, low-impact workout plan and include a disclaimer to consult a doctor. Avoid high-impact exercises.

Important Rule: You MUST structure the plan so that each major muscle group ('chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings') is trained at least twice during the 7-day week.

**USE ONLY THESE EXERCISE NAMES (they have verified preview videos):**

CHEST: bench press, incline bench press, dumbbell bench press, chest fly, cable crossover, push-ups, dips
BACK: deadlift, pull-ups, lat pulldown, seated row, barbell row, dumbbell row, t-bar row, face pull
SHOULDERS: shoulder press, overhead press, dumbbell shoulder press, lateral raise, front raise, rear delt fly, arnold press, upright row
LEGS (QUADS): squats, front squat, leg press, leg extension, lunges, bulgarian split squat, hack squat, goblet squat
LEGS (HAMSTRINGS): leg curl, seated leg curl, romanian deadlift, good morning, nordic curl
LEGS (GLUTES): hip thrust, glute bridge, cable kickback
LEGS (CALVES): calf raise, standing calf raise, seated calf raise
BICEPS: bicep curl, barbell curl, dumbbell curl, hammer curl, preacher curl, cable curl, concentration curl
TRICEPS: tricep dips, tricep pushdown, overhead extension, skull crusher, close grip bench, diamond pushup, kickback
ABS: plank, side plank, sit-ups, crunches, bicycle crunch, reverse crunch, leg raise, hanging leg raise, mountain climber, russian twist, cable crunch
CARDIO: burpees, jumping jacks, high knees, box jumps, battle ropes

Provide a catchy title for the whole week, a short description, and a weekly schedule.
For each of the 7 days, provide a day number, a title for the day's workout, a short description, and a list of specific exercises with sets, reps, rest times, and the primary muscle groups targeted.
The number of workout days in the schedule should match the user's 'Days per week' preference. The remaining days should be rest days.
The muscle groups should be from this list: 'chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings', 'calves'.
For the videoUrl field for each exercise, you MUST return the string 'pending'.
If a day is a rest day, the 'exercises' array should be empty.
The exercises should be appropriate for the selected equipment availability.`,
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
    
    // Add exercise IDs after AI generation
    if (output.weeklySchedule) {
      for (const day of output.weeklySchedule) {
        if (day.exercises) {
          for (const exercise of day.exercises) {
            const exerciseId = getExerciseId(exercise.name);
            (exercise as any).exerciseId = exerciseId;
          }
        }
      }
    }
    
    return output;
  }
);


export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}
