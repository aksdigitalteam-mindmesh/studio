"use server";

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = process.env.EXERCISEDB_API_KEY;

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  if (!API_KEY || API_KEY === "YOUR_EXERCISEDB_API_KEY_HERE") {
    console.error('CRITICAL: ExerciseDB API key is not configured in .env file.');
    return 'error';
  }

  try {
    console.log(`Fetching GIF for exercise ID: ${exerciseId}`);
    
    const url = `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      },
      // Disable caching for this specific API call to ensure fresh data
      cache: 'no-store'
    });

    console.log(`Response status for ${exerciseId}:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch exercise ${exerciseId}:`, response.status, errorText);
      return 'error';
    }

    const data = await response.json();
    
    if (data && data.gifUrl) {
      console.log(`✅ Found GIF URL for ${exerciseId}`);
      return data.gifUrl;
    }
    
    console.warn(`No gifUrl in response for ${exerciseId}`);
    return 'error';
  } catch (error) {
    console.error(`Error fetching exercise GIF by ID ${exerciseId}:`, error);
    return 'error';
  }
}

export async function enrichWorkoutPlanWithGifs(workoutPlan: any) {
  if (!workoutPlan || !workoutPlan.weeklySchedule) {
    console.log('No workout plan to enrich');
    return workoutPlan;
  }

  console.log('Starting to enrich workout plan with GIFs...');
  const enrichedPlan = JSON.parse(JSON.stringify(workoutPlan)); // Deep clone

  try {
    for (const day of enrichedPlan.weeklySchedule) {
      if (day.exercises && day.exercises.length > 0) {
        
        for (let i = 0; i < day.exercises.length; i++) {
          const exercise = day.exercises[i];
          
          if (exercise.exerciseId && exercise.exerciseId !== '0001') {
            const gifUrl = await fetchExerciseGifById(exercise.exerciseId);
            exercise.videoUrl = gifUrl;
          } else {
            console.warn(`Invalid or missing exercise ID for ${exercise.name}. Defaulting to 'error'.`);
            exercise.videoUrl = 'error';
          }
          
          // Add a small delay between requests to avoid potential rate-limiting issues
          if (i < day.exercises.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        }
      }
    }
    
    console.log('✅ Finished enriching workout plan with GIFs');
  } catch (error) {
    console.error('❌ Error during the GIF enrichment process:', error);
  }

  return enrichedPlan;
}
