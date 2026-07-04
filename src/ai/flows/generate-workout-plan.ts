'use server';

import { z } from 'zod';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z.string(),
  intensity: z.enum(['low', 'medium', 'high']),
  duration: z.number(),
  daysPerWeek: z.number(),
  equipment: z.enum(['with', 'without']),
  bodyFocus: z.string().optional(),
  medicalConditions: z.string().optional(),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
  name: z.string(),
  exerciseId: z.string(),
  sets: z.string(),
  reps: z.string(),
  rest: z.string(),
  videoUrl: z.string(),
  muscleGroups: z.array(z.string()),
});

const DailyWorkoutSchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(),
  exercises: z.array(ExerciseSchema).optional(),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  weeklySchedule: z.array(DailyWorkoutSchema),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

async function callGemini(prompt: string): Promise<GenerateWorkoutPlanOutput> {
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

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  const prompt = `You are an expert personal trainer. Generate a 7-day workout plan:
  - Fitness Goals: ${input.fitnessGoals}
  - Intensity: ${input.intensity}
  - Duration: ${input.duration} mins
  - Days Per Week: ${input.daysPerWeek}
  - Equipment: ${input.equipment}
  - Focus: ${input.bodyFocus || 'Full Body'}
  - Health Notes: ${input.medicalConditions || 'None'}

  Return ONLY a valid JSON object matching this schema:
  {
    "title": "String",
    "description": "String",
    "weeklySchedule": [
      {
        "day": number,
        "title": "String",
        "description": "String",
        "exercises": [
          {
            "name": "String",
            "exerciseId": "0001",
            "sets": "String",
            "reps": "String",
            "rest": "String",
            "videoUrl": "pending",
            "muscleGroups": ["chest", "back", etc]
          }
        ]
      }
    ]
  }`;

  return callGemini(prompt);
}