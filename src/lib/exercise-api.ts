// src/lib/exercise-api.ts

export async function searchExercises(query: string, limit: number = 10) {
  const apiKey = process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY;
  if (!apiKey) {
    console.warn("ExerciseDB API key not found. Skipping API search.");
    return [];
  }

  const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(query)}?limit=${limit}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`ExerciseDB API error: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch from ExerciseDB API:', error);
    return [];
  }
}

export async function getExercisesByBodyPart(bodyPart: string, limit: number = 10) {
  const apiKey = process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY;
  if (!apiKey) {
    console.warn("ExerciseDB API key not found. Skipping API search.");
    return [];
  }
  
  const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${limit}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
     if (!response.ok) {
      console.error(`ExerciseDB API error: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch from ExerciseDB API:', error);
    return [];
  }
}
