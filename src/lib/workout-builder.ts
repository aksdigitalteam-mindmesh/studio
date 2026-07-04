
/**
 * Logic to build a workout plan from the inbuilt directory.
 */
import { WORKOUT_DATABASE, type InbuiltExercise } from './workout-database';

type BuildInput = {
  fitnessGoals: string;
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  daysPerWeek: number;
  equipment: 'with' | 'without';
  bodyFocus?: string;
};

export function buildLocalWorkoutPlan(input: BuildInput) {
  const { daysPerWeek, equipment, intensity, fitnessGoals } = input;
  
  // 1. Filter database based on equipment availability
  const availableExercises = WORKOUT_DATABASE.filter(ex => 
    equipment === 'with' || ex.equipment === 'without'
  );

  // 2. Define schedule structure based on days per week
  const schedule: any[] = [];
  const muscleGroups = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'biceps', 'triceps', 'abs'];
  
  for (let day = 1; day <= 7; day++) {
    const dailyWorkout: any = {
      day,
      title: 'Rest Day',
      description: 'Rest and recover for your next session.',
      exercises: []
    };

    // Simple distribution logic: work out on specific days
    const isWorkoutDay = daysPerWeek >= day || (daysPerWeek === 3 && [1, 3, 5].includes(day)) || (daysPerWeek === 4 && [1, 2, 4, 5].includes(day)) || (daysPerWeek === 5 && day <= 5);

    if (isWorkoutDay && day <= daysPerWeek) {
      // Determine focus for the day
      let focus: string[] = [];
      if (daysPerWeek <= 3) {
        focus = muscleGroups; // Full Body
        dailyWorkout.title = 'Full Body Power';
        dailyWorkout.description = 'A comprehensive session covering all major muscle groups.';
      } else if (daysPerWeek === 4) {
        // Upper/Lower Split
        if (day % 2 !== 0) {
          focus = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
          dailyWorkout.title = 'Upper Body Sculpt';
        } else {
          focus = ['quads', 'hamstrings', 'glutes', 'abs'];
          dailyWorkout.title = 'Lower Body & Core';
        }
      } else {
        // PPL style
        if (day === 1 || day === 4) {
          focus = ['chest', 'shoulders', 'triceps'];
          dailyWorkout.title = 'Push Day';
        } else if (day === 2 || day === 5) {
          focus = ['back', 'biceps'];
          dailyWorkout.title = 'Pull Day';
        } else {
          focus = ['quads', 'hamstrings', 'abs'];
          dailyWorkout.title = 'Leg Day';
        }
      }

      // Pick 5-7 exercises matching the focus
      const selected = availableExercises
        .filter(ex => ex.muscleGroups.some(m => focus.includes(m)))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(5, Math.floor(input.duration / 10)));

      dailyWorkout.exercises = selected.map(ex => ({
        name: ex.name,
        sets: String(ex.baseSets + (intensity === 'high' ? 1 : 0)),
        reps: ex.baseReps,
        rest: intensity === 'low' ? '90s' : '60s',
        muscleGroups: ex.muscleGroups,
        videoUrl: 'pending' // Handled by image enrichment
      }));
    }

    schedule.push(dailyWorkout);
  }

  return {
    title: `${fitnessGoals.split(' ')[0]} 7-Day Plan`,
    description: `A custom generated ${input.duration} minute plan for ${input.daysPerWeek} days a week.`,
    weeklySchedule: schedule
  };
}
