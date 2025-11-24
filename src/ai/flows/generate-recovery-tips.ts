
'use server';

/**
 * @fileOverview Generates recovery tips for fatigued muscles.
 *
 * - generateRecoveryTips - A function that generates recovery tips.
 * - GenerateRecoveryTipsInput - The input type for the generateRecoveryTips function.
 * - GenerateRecoveryTipsOutput - The return type for the generateRecoveryTips function.
 */

import { z } from 'genkit';

const GenerateRecoveryTipsInputSchema = z.object({
  fatiguedMuscles: z.array(z.string()).describe('A list of the most fatigued muscle groups.'),
});
export type GenerateRecoveryTipsInput = z.infer<typeof GenerateRecoveryTipsInputSchema>;

const TipSchema = z.object({
    title: z.string().describe("A short, catchy title for the recovery tip."),
    description: z.string().describe("A detailed, actionable description of the recovery technique."),
});

const GenerateRecoveryTipsOutputSchema = z.object({
    tips: z.array(TipSchema).describe('A list of 3-5 personalized recovery tips.'),
});
export type GenerateRecoveryTipsOutput = z.infer<typeof GenerateRecoveryTipsOutputSchema>;

async function callGemini(prompt: string): Promise<GenerateRecoveryTipsOutput> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const jsonText = data.candidates[0].content.parts[0].text;
  return JSON.parse(jsonText) as GenerateRecoveryTipsOutput;
}


export async function generateRecoveryTips(
  input: GenerateRecoveryTipsInput
): Promise<GenerateRecoveryTipsOutput> {
  
  const prompt = `You are a sports recovery specialist and physiotherapist. A user is experiencing high fatigue in the following muscle groups: ${input.fatiguedMuscles.join(', ')}.

  Please generate 3-5 actionable and effective recovery tips to help them alleviate muscle soreness and recover faster. For each tip, provide a clear title and a concise description. Focus on practical advice like stretching, nutrition, hydration, and rest techniques.

  Return the response as a single, valid JSON object that conforms to this Zod schema:
  
  const GenerateRecoveryTipsOutputSchema = ${JSON.stringify(GenerateRecoveryTipsOutputSchema.shape, null, 2)};
  `;

  return callGemini(prompt);
}
