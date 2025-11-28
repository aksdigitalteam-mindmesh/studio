
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
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || API_KEY === 'SET_YOUR_API_KEY') {
    throw new Error("GEMINI_API_KEY is not set in the .env file. Please add it and restart the server.");
  }
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.5,
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
    throw new Error(`API call failed with status ${response.status}. Please check your API key, billing status, and that the Generative Language API is enabled.`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Failed to parse the response from the AI. The structure was not as expected.");
  }
  const jsonText = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(jsonText) as GenerateRecoveryTipsOutput;
  } catch (e) {
      console.error("Failed to parse JSON from Gemini response:", e);
      console.error("Received text from API:", jsonText);
      throw new Error("The AI returned an invalid JSON response. Please try generating again.");
  }
}


export async function generateRecoveryTips(
  input: GenerateRecoveryTipsInput
): Promise<GenerateRecoveryTipsOutput> {
  
  const prompt = `You are a sports recovery specialist and physiotherapist. A user is experiencing high fatigue in the following muscle groups: ${input.fatiguedMuscles.join(', ')}.

  Please generate 3-5 actionable and effective recovery tips to help them alleviate muscle soreness and recover faster. For each tip, provide a clear title and a concise description. Focus on practical advice like stretching, nutrition, hydration, and rest techniques.

  You MUST return the response as a single, valid JSON object that strictly conforms to this Zod schema:
  
  const GenerateRecoveryTipsOutputSchema = ${JSON.stringify(GenerateRecoveryTipsOutputSchema.shape, null, 2)};

  Do not add any introductory text or markdown formatting around the JSON object. The response must be only the JSON.
  `;

  return callGemini(prompt);
}
