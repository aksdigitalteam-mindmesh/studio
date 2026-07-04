'use server';

/**
 * @fileOverview Returns a placeholder image URL for an exercise.
 */

import { z } from 'zod';

const GenerateExerciseMediaInputSchema = z.object({
  exerciseName: z.string(),
});
export type GenerateExerciseMediaInput = z.infer<typeof GenerateExerciseMediaInputSchema>;

const GenerateExerciseMediaOutputSchema = z.object({
  imageUrl: z.string(),
});
export type GenerateExerciseMediaOutput = z.infer<typeof GenerateExerciseMediaOutputSchema>;

export async function generateExerciseMedia(
  { exerciseName }: GenerateExerciseMediaInput
): Promise<GenerateExerciseMediaOutput> {
  // Using a reliable placeholder since image generation models can be unstable
  const seed = Math.floor(Math.random() * 1000);
  return {
    imageUrl: `https://picsum.photos/seed/${seed}/600/400`
  };
}