"use server";

const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = process.env.EXERCISEDB_API_KEY;

export async function fetchExerciseGifById(exerciseId: string): Promise<string> {
  if (!API_KEY || API_KEY === 'YOUR_EXERCISEDB_API_KEY_HERE') {
    console.warn('ExerciseDB API key not found in .env file. Please add EXERCISEDB_API_KEY.');
    return 'error';
  }

  try {
    console.log(`Fetching GIF for exercise ID: ${exerciseId}`);
    
    // Correct endpoint format based on RapidAPI docs
    const url = `${EXERCISEDB_API_URL}/exercises/exercise/${exerciseId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    });

    console.log(`Response status for ${exerciseId}:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch exercise ${exerciseId}:`, response.status, errorText);
      return 'error';
    }

    const data = await response.json();
    
    if (data && data.gifUrl) {
      console.log(`✅ Found GIF URL: ${data.gifUrl}`);
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
        console.log(`Processing Day ${day.day} with ${day.exercises.length} exercises`);
        
        // Fetch GIFs with a small delay between requests
        for (let i = 0; i < day.exercises.length; i++) {
          const exercise = day.exercises[i];
          console.log(`Fetching GIF for: ${exercise.name} (ID: ${exercise.exerciseId})`);
          
          if (exercise.exerciseId && exercise.exerciseId !== '0001') {
            const gifUrl = await fetchExerciseGifById(exercise.exerciseId);
            exercise.videoUrl = gifUrl;
            console.log(`Result for ${exercise.name}: ${gifUrl}`);
          } else {
            console.warn(`Invalid exercise ID for ${exercise.name}: ${exercise.exerciseId}`);
            exercise.videoUrl = 'error';
          }
          
          // Add a 200ms delay between requests to avoid rate limiting
          if (i < day.exercises.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    }
    
    console.log('✅ Finished enriching workout plan with GIFs');
  } catch (error) {
    console.error('❌ Error enriching workout plan:', error);
  }

  return enrichedPlan;
}
