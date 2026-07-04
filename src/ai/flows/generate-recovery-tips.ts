'use server';

import { z } from 'zod';

const GenerateRecoveryTipsInputSchema = z.object({
  fatiguedMuscles: z.array(z.string()),
});
export type GenerateRecoveryTipsInput = z.infer<typeof GenerateRecoveryTipsInputSchema>;

const TipSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const GenerateRecoveryTipsOutputSchema = z.object({
  tips: z.array(TipSchema),
});
export type GenerateRecoveryTipsOutput = z.infer<typeof GenerateRecoveryTipsOutputSchema>;

async function callGemini(prompt: string): Promise<GenerateRecoveryTipsOutput> {
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

  return JSON.parse(jsonString);
}

export async function generateRecoveryTips(input: GenerateRecoveryTipsInput): Promise<GenerateRecoveryTipsOutput> {
  const prompt = `You are a physiotherapist. User has fatigue in: ${input.fatiguedMuscles.join(', ')}.
  Provide 3-5 actionable recovery tips.
  Return ONLY JSON: { "tips": [{ "title": "String", "description": "String" }] }`;

  return callGemini(prompt);
}