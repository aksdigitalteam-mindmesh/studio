
'use server';

import { z } from 'zod';
import OpenAI from 'openai';

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
  exerciseId: z.string().describe('ExerciseDB ID - will be auto-populated.'),
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

async function callOpenAI(prompt: string): Promise<GenerateWorkoutPlanOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the .env file.");
  }
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const jsonString = response.choices[0]?.message?.content;
  if (!jsonString) {
    throw new Error("Failed to get a valid response from the AI.");
  }

  try {
    const parsedJson = JSON.parse(jsonString);
    const validationResult = GenerateWorkoutPlanOutputSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      console.error("AI output failed Zod validation:", validationResult.error);
      throw new Error("The AI returned data in an unexpected format.");
    }
    return validationResult.data;
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", e);
    throw new Error("The AI returned an invalid JSON response.");
  }
}

export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {

  const prompt = `You are an expert certified personal trainer. Generate a personalized 7-day workout plan based on the user's preferences.

  User Details:
  - Fitness Goals: ${input.fitnessGoals}
  - Intensity: ${input.intensity}
  - Duration per session: ${input.duration} minutes
  - Days per week: ${input.daysPerWeek}
  - Equipment: ${input.equipment} equipment
  - Body Focus: ${input.bodyFocus || 'Full Body'}
  - Medical Conditions: ${input.medicalConditions || 'None'}

  Your Task:
  - Create a 7-day workout schedule.
  - Provide a catchy title and a short description for the whole week.
  - For each day, provide a day number, a title, a description, and a list of exercises.
  - For each exercise, specify name, sets, reps, rest time, and the primary muscle groups targeted.
  
  Important Rules:
  - If the user has specified any medical conditions, you MUST create a safe, low-impact workout plan and include a disclaimer to consult a doctor. Avoid high-impact exercises.
  - You MUST structure the plan so that each major muscle group ('chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings') is trained at least twice during the 7-day week, provided the user works out 4 or more days. If they work out fewer than 4 days, train each muscle group at least once. Ensure proper rest between training the same muscle group.
  - The number of workout days in the schedule should match the user's 'Days per week' preference. The remaining days should be rest days.
  - For rest days, the 'exercises' array should be empty.
  - The exercises must be appropriate for the selected equipment availability.
  
  JSON Output Formatting:
  - For the 'exerciseId' field, use "0001" for all exercises (this is a placeholder).
  - For the 'videoUrl' field for each exercise, you MUST return the string 'pending'.
  - The 'muscleGroups' array must only contain values from this list: 'chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings', 'calves'.
  - You MUST return the response as a single, valid JSON object that strictly conforms to this Zod schema:

  const GenerateWorkoutPlanOutputSchema = ${JSON.stringify(GenerateWorkoutPlanOutputSchema.shape, null, 2)};

  Do not add any introductory text or markdown formatting around the JSON object. The response must be only the JSON.
`;
  
  return callOpenAI(prompt);
}
