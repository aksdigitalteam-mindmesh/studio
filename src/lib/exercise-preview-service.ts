
"use server";

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY;

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  if (!API_KEY) {
    console.warn('ExerciseDB API key not found. Set NEXT_PUBLIC_EXERCISEDB_API_KEY in your environment variables.');
    return 'error';
  }

  try {
    const response = await fetch(
      `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`,
      {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
        console.error(`Error fetching GIF for ID ${exerciseId}: ${response.status} ${response.statusText}`);
        return 'error';
    }

    const data = await response.json();
    return data.gifUrl || 'error';
  } catch (error) {
    console.error(`Error fetching exercise GIF by ID ${exerciseId}:`, error);
    return 'error';
  }
}

export async function enrichWorkoutPlanWithGifs(workoutPlan: any) {
  if (!workoutPlan || !workoutPlan.weeklySchedule) return workoutPlan;

  const enrichedPlan = { ...workoutPlan };

  for (const day of enrichedPlan.weeklySchedule) {
    if (day.exercises && day.exercises.length > 0) {
      const gifPromises = day.exercises.map((exercise: any) => 
        fetchExerciseGifById(exercise.exerciseId || '0001')
      );
      
      const gifs = await Promise.all(gifPromises);
      
      day.exercises.forEach((exercise: any, index: number) => {
        exercise.videoUrl = gifs[index];
      });
    }
  }

  return enrichedPlan;
}
