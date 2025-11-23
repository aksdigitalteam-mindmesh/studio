
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

const recoveryPrompt = ai.definePrompt({
    name: 'recoveryPrompt',
    model: 'googleai/gemini-pro',
    input: { schema: GenerateRecoveryTipsInputSchema },
    output: { schema: GenerateRecoveryTipsOutputSchema },
    prompt: `You are a sports recovery specialist and physiotherapist. A user is experiencing high fatigue in the following muscle groups: {{{fatiguedMuscles}}}.

  Please generate 3-5 actionable and effective recovery tips to help them alleviate muscle soreness and recover faster. For each tip, provide a clear title and a concise description. Focus on practical advice like stretching, nutrition, hydration, and rest techniques.`,
});

const generateRecoveryTipsFlow = ai.defineFlow(
  {
    name: 'generateRecoveryTipsFlow',
    inputSchema: GenerateRecoveryTipsInputSchema,
    outputSchema: GenerateRecoveryTipsOutputSchema,
  },
  async (input) => {
    const {output} = await recoveryPrompt(input);
    return output!;
  }
);


export async function generateRecoveryTips(
  input: GenerateRecoveryTipsInput
): Promise<GenerateRecoveryTipsOutput> {
  return generateRecoveryTipsFlow(input);
}
