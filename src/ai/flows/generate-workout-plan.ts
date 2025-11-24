
'use server';

import { z } from 'genkit';

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

async function callGemini(prompt: string): Promise<GenerateWorkoutPlanOutput> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
  }
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.4,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", errorText);
    throw new Error(`API call failed with status ${response.status}. Please check your API key and billing status.`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Failed to parse the response from the AI. The structure was not as expected.");
  }
  const jsonText = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(jsonText) as GenerateWorkoutPlanOutput;
  } catch (e) {
      console.error("Failed to parse JSON from Gemini response:", e);
      console.error("Received text from API:", jsonText);
      throw new Error("The AI returned an invalid response. Please try generating again.");
  }
}


export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {

  const prompt = `You are an expert certified personal trainer. Generate a personalized 7-day workout plan based on the user's preferences.

Fitness Goals: ${input.fitnessGoals}
Intensity: ${input.intensity}
Duration per session: ${input.duration} minutes
Days per week: ${input.daysPerWeek}
Equipment: ${input.equipment} equipment
Body Focus: ${input.bodyFocus || 'Full Body'}
Medical Conditions: ${input.medicalConditions || 'None'}

If the user has specified any medical conditions, you MUST create a safe, low-impact workout plan and include a disclaimer to consult a doctor. Avoid high-impact exercises.

Important Rule: You MUST structure the plan so that each major muscle group ('chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings') is trained at least twice during the 7-day week, provided the user works out 4 or more days. If they work out fewer than 4 days, train each muscle group at least once. Ensure proper rest between training the same muscle group.

Provide a catchy title for the whole week, a short description, and a weekly schedule.
For each of the 7 days, provide a day number, a title for the day's workout, a short description, and a list of specific exercises with sets, reps, rest times, and the primary muscle groups targeted.
The number of workout days in the schedule should match the user's 'Days per week' preference. The remaining days should be rest days.
The muscle groups must be from this list: 'chest', 'biceps', 'abs', 'quads', 'shoulders', 'back', 'triceps', 'glutes', 'hamstrings', 'calves'.
For the exerciseId field, use "0001" for all exercises (this is a placeholder and will be replaced later).
For the videoUrl field for each exercise, you MUST return the string 'pending'.
If a day is a rest day, the 'exercises' array should be empty.
The exercises should be appropriate for the selected equipment availability.

You MUST return the response as a single, valid JSON object that strictly conforms to this Zod schema:

const GenerateWorkoutPlanOutputSchema = ${JSON.stringify(GenerateWorkoutPlanOutputSchema.shape, null, 2)};

Do not add any introductory text or markdown formatting around the JSON object. The response must be only the JSON.
`;
  
  return callGemini(prompt);
}
