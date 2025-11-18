
"use server";

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = process.env.EXERCISEDB_API_KEY;

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  if (!API_KEY) {
    console.error('CRITICAL: ExerciseDB API key not found in environment variables. Set EXERCISEDB_API_KEY in your .env file.');
    return 'error';
  }

  try {
    const response = await fetch(
      `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': API_KEY, // CORRECT: All lowercase header
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        },
        cache: 'force-cache'
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch exercise GIF for ID ${exerciseId}. Status: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error Body:', errorBody);
      return 'error';
    }

    const data = await response.json();
    return data.gifUrl || 'error';
  } catch (error) {
    console.error(`An exception occurred while fetching exercise GIF for ID ${exerciseId}:`, error);
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
    console.error('Error enriching workout plan with GIFs:', error);
  }

  return enrichedPlan;
}
