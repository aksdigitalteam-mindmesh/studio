
'use server';

/**
 * @fileOverview Generates recovery tips for fatigued muscles.
 *
 * - generateRecoveryTips - A function that generates recovery tips.
 * - GenerateRecoveryTipsInput - The input type for the generateRecoveryTips function.
 * - GenerateRecoveryTipsOutput - The return type for the generateRecoveryTips function.
 */

import { z } from 'zod';
import OpenAI from 'openai';

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

async function callOpenAI(prompt: string): Promise<GenerateRecoveryTipsOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the .env file.");
  }
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const jsonString = response.choices[0]?.message?.content;
  if (!jsonString) {
    throw new Error("Failed to get a valid response from the AI.");
  }

  try {
    const parsedJson = JSON.parse(jsonString);
    const validationResult = GenerateRecoveryTipsOutputSchema.safeParse(parsedJson);
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

export async function generateRecoveryTips(
  input: GenerateRecoveryTipsInput
): Promise<GenerateRecoveryTipsOutput> {
  
  const prompt = `You are a sports recovery specialist and physiotherapist. A user is experiencing high fatigue in the following muscle groups: ${input.fatiguedMuscles.join(', ')}.

  Your Task:
  Please generate 3-5 actionable and effective recovery tips to help them alleviate muscle soreness and recover faster. For each tip, provide a clear title and a concise description. Focus on practical advice like stretching, nutrition, hydration, and rest techniques.

  Constraints:
  - You MUST return the response as a single, valid JSON object that strictly conforms to this Zod schema:
  
  const GenerateRecoveryTipsOutputSchema = ${JSON.stringify(GenerateRecoveryTipsOutputSchema.shape, null, 2)};

  - Do not add any introductory text, markdown formatting, or any other text outside of the JSON object.
  `;

  return callOpenAI(prompt);
}
