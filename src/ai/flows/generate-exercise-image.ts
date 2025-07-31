'use server';

/**
 * @fileOverview Generates an image for a given fitness exercise.
 *
 * - generateExerciseImage - A function that generates an image for an exercise.
 * - GenerateExerciseImageInput - The input type for the generateExerciseImage function.
 * - GenerateExerciseImageOutput - The return type for the generateExerciseImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExerciseImageInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise to generate an image for.'),
});
export type GenerateExerciseImageInput = z.infer<typeof GenerateExerciseImageInputSchema>;

const GenerateExerciseImageOutputSchema = z.object({
  imageUrl: z.string().url().describe('The data URI of the generated image.'),
});
export type GenerateExerciseImageOutput = z.infer<typeof GenerateExerciseImageOutputSchema>;

export async function generateExerciseImage(
  input: GenerateExerciseImageInput
): Promise<GenerateExerciseImageOutput> {
    return generateExerciseImageFlow(input);
}


const generateExerciseImageFlow = ai.defineFlow(
  {
    name: 'generateExerciseImageFlow',
    inputSchema: GenerateExerciseImageInputSchema,
    outputSchema: GenerateExerciseImageOutputSchema,
  },
  async ({ exerciseName }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a clean, simple, vector-style illustration of a person performing the '${exerciseName}' exercise. The background should be a solid, light grey color. The person should be gender-neutral and wearing simple workout attire. The style should be minimalist and clear.`,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
