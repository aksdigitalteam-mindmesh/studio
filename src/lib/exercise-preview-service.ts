
"use server";
import { generateExerciseMedia } from "@/ai/flows/generate-exercise-media";

export async function enrichWorkoutPlanWithImages(workoutPlan: any) {
  if (!workoutPlan || !workoutPlan.weeklySchedule) {
    console.log('No workout plan to enrich');
    return workoutPlan;
  }

  console.log('Starting to enrich workout plan with images...');
  const enrichedPlan = JSON.parse(JSON.stringify(workoutPlan)); // Deep clone

  try {
    for (const day of enrichedPlan.weeklySchedule) {
      if (day.exercises && day.exercises.length > 0) {
        
        const imagePromises = day.exercises.map((exercise: any) => {
          if (exercise.name) {
            return generateExerciseMedia({ exerciseName: exercise.name });
          }
          return Promise.resolve({ imageUrl: 'error' });
        });
        
        const results = await Promise.all(imagePromises);
        
        for (let i = 0; i < day.exercises.length; i++) {
          day.exercises[i].videoUrl = results[i].imageUrl; // The field is named videoUrl in the component, so we'll use that
        }
      }
    }
    
    console.log('✅ Finished enriching workout plan with images');
  } catch (error) {
    console.error('❌ Error during the image enrichment process:', error);
    // Even if there's an error, return the plan without images
    for (const day of enrichedPlan.weeklySchedule) {
        if (day.exercises) {
            for (const exercise of day.exercises) {
                if (!exercise.videoUrl) {
                    exercise.videoUrl = 'error';
                }
            }
        }
    }
  }

  return enrichedPlan;
}
