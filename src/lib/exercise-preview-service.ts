"use server";

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = '64af1fa9demsh6d0f3820b7a1c1fp1f4c4djsn4aa38d5fcf5d';

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  if (!API_KEY) {
    console.warn('ExerciseDB API key not found');
    return 'error';
  }

  try {
    // Use the correct endpoint format
    const response = await fetch(
      `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        },
        cache: 'force-cache'
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch exercise ${exerciseId}:`, response.status);
      return 'error';
    }

    const data = await response.json();
    return data.gifUrl || 'error';
  } catch (error) {
    console.error('Error fetching exercise GIF by ID:', error);
    return 'error';
  }
}

export async function enrichWorkoutPlanWithGifs(workoutPlan: any) {
  if (!workoutPlan || !workoutPlan.weeklySchedule) {
    return workoutPlan;
  }

  const enrichedPlan = JSON.parse(JSON.stringify(workoutPlan)); // Deep clone

  try {
    for (const day of enrichedPlan.weeklySchedule) {
      if (day.exercises && day.exercises.length > 0) {
        // Fetch GIFs sequentially to avoid rate limiting
        for (const exercise of day.exercises) {
          if (exercise.exerciseId && exercise.exerciseId !== '0001') {
            const gifUrl = await fetchExerciseGifById(exercise.exerciseId);
            exercise.videoUrl = gifUrl;
          } else {
            exercise.videoUrl = 'error';
          }
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
  } catch (error) {
    console.error('Error enriching workout plan:', error);
  }

  return enrichedPlan;
}