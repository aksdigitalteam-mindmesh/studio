
'use server';

/**
 * @fileOverview Generates an image for a given fitness exercise using DALL-E 3.
 *
 * - generateExerciseMedia - A function that generates an image for an exercise.
 * - GenerateExerciseMediaInput - The input type for the generateExerciseMedia function.
 * - GenerateExerciseMediaOutput - The return type for the generateExerciseMedia function.
 */

import { z } from 'zod';
import { openai } from '@/lib/openai';

const GenerateExerciseMediaInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise to generate an image for.'),
});
export type GenerateExerciseMediaInput = z.infer<typeof GenerateExerciseMediaInputSchema>;

const GenerateExerciseMediaOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image, or an error string.'),
});
export type GenerateExerciseMediaOutput = z.infer<typeof GenerateExerciseMediaOutputSchema>;


async function callOpenAI(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: 'url',
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
        throw new Error("Failed to get a valid image URL from the AI.");
    }
    return imageUrl;
  } catch (error: any) {
     console.error("Error calling OpenAI Image API:", error);
     // Check for specific billing error
     if (error.code === 'billing_not_active') {
       throw new Error("OpenAI account has no credit. Please add credit to your account to generate images.");
     }
     throw new Error(error.message || "An unknown error occurred while generating the image.");
  }
}


export async function generateExerciseMedia(
  { exerciseName }: GenerateExerciseMediaInput
): Promise<GenerateExerciseMediaOutput> {
  try {
      const prompt = `Generate a clean, simple, vector-style instructional illustration of a person performing the '${exerciseName}' exercise. The background should be a solid, light grey color. The person should be gender-neutral and wearing simple workout attire. The style should be minimalist and clear, focusing on proper form, like a diagram in a fitness manual.`;

      const imageUrl = await callOpenAI(prompt);

      if (!imageUrl) {
        throw new Error('Image generation failed or returned no media.');
      }

      return {
        imageUrl: imageUrl,
      };
    } catch (error) {
      console.error(`Failed to generate image for ${exerciseName}:`, error);
      return {
        imageUrl: 'error' 
      };
    }
}
