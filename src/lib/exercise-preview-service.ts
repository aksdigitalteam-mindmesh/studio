"use server";

/**
 * Service to enrich workouts with images/GIFs from ExerciseDB.
 */

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  const apiKey = process.env.EXERCISEDB_API_KEY;
  
  if (!apiKey) {
    console.error('CRITICAL: ExerciseDB API key is not configured.');
    return 'error';
  }

  try {
    const url = `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      },
      cache: 'no-store'
    });

    if (!response.ok) return 'error';

    const data = await response.json();
    return data.gifUrl || 'error';
  } catch (error) {
    console.error(`Error fetching exercise GIF:`, error);
    return 'error';
  }
}

export async function enrichWorkoutPlanWithImages(workoutPlan: any) {
  if (!workoutPlan || !workoutPlan.weeklySchedule) return workoutPlan;

  const enrichedPlan = JSON.parse(JSON.stringify(workoutPlan));

  for (const day of enrichedPlan.weeklySchedule) {
    if (day.exercises && day.exercises.length > 0) {
      for (let i = 0; i < day.exercises.length; i++) {
        const exercise = day.exercises[i];
        if (exercise.exerciseId && exercise.exerciseId !== '0001') {
          exercise.videoUrl = await fetchExerciseGifById(exercise.exerciseId);
        } else {
          // Fallback to placeholder if ID is missing
          exercise.videoUrl = `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/400/300`;
        }
      }
    }
  }

  return enrichedPlan;
}