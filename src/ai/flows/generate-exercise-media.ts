'use server';

/**
 * @fileOverview Generates a video for a given fitness exercise.
 *
 * - generateExerciseMedia - A function that generates a video for an exercise.
 * - GenerateExerciseMediaInput - The input type for the generateExerciseMedia function.
 * - GenerateExerciseMediaOutput - The return type for the generateExerciseMedia function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const GenerateExerciseMediaInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise to generate a video for.'),
});
export type GenerateExerciseMediaInput = z.infer<typeof GenerateExerciseMediaInputSchema>;

const GenerateExerciseMediaOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateExerciseMediaOutput = z.infer<typeof GenerateExerciseMediaOutputSchema>;

export async function generateExerciseMedia(
  input: GenerateExerciseMediaInput
): Promise<GenerateExerciseMediaOutput> {
    return generateExerciseMediaFlow(input);
}


const generateExerciseMediaFlow = ai.defineFlow(
  {
    name: 'generateExerciseMediaFlow',
    inputSchema: GenerateExerciseMediaInputSchema,
    outputSchema: GenerateExerciseMediaOutputSchema,
  },
  async ({ exerciseName }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: `Generate a clean, simple, vector-style animation of a person performing the '${exerciseName}' exercise. The background should be a solid, light grey color. The person should be gender-neutral and wearing simple workout attire. The style should be minimalist and clear, focusing on proper form.`,
      config: {
        durationSeconds: 6,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait for the operation to complete
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    
    if (!video || !video.media?.url) {
      throw new Error('Video generation failed or returned no media.');
    }

    return {
      videoUrl: video.media.url,
    };
  }
);
