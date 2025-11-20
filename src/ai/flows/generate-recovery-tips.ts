
'use server';

/**
 * @fileOverview Generates recovery tips for fatigued muscles.
 *
 * - generateRecoveryTips - A function that generates recovery tips.
 * - GenerateRecoveryTipsInput - The input type for the generateRecoveryTips function.
 * - GenerateRecoveryTipsOutput - The return type for the generateRecoveryTips function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


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

async function generateTips(input: GenerateRecoveryTipsInput): Promise<GenerateRecoveryTipsOutput> {
  const prompt = `You are a sports recovery specialist and physiotherapist. A user is experiencing high fatigue in the following muscle groups: ${input.fatiguedMuscles.join(', ')}.

  Please generate 3-5 actionable and effective recovery tips to help them alleviate muscle soreness and recover faster. For each tip, provide a clear title and a concise description. Focus on practical advice like stretching, nutrition, hydration, and rest techniques.
  
  You must return the response in a structured JSON format that matches the following Zod schema:
  ${JSON.stringify(GenerateRecoveryTipsOutputSchema.shape)}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a physiotherapy AI that returns structured JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message?.content;
  if (!content) {
    throw new Error("Failed to generate recovery tips");
  }

  const parsed = JSON.parse(content);
  return GenerateRecoveryTipsOutputSchema.parse(parsed);
}


const generateRecoveryTipsFlow = ai.defineFlow(
  {
    name: 'generateRecoveryTipsFlow',
    inputSchema: GenerateRecoveryTipsInputSchema,
    outputSchema: GenerateRecoveryTipsOutputSchema,
  },
  async (input) => {
    return await generateTips(input);
  }
);


export async function generateRecoveryTips(
  input: GenerateRecoveryTipsInput
): Promise<GenerateRecoveryTipsOutput> {
  return generateRecoveryTipsFlow(input);
}
