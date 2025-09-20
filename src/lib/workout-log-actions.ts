
"use client";

// These are client-side actions that interact with localStorage
const WORKOUT_LOG_STORAGE_KEY = 'completedWorkouts';
const LATEST_WORKOUT_PLAN_KEY = 'latestWorkoutPlan';
const FATIGUE_STORAGE_KEY = 'muscleFatigueData';

type CompletedWorkout = {
  title: string;
  date: string;
};

type Exercise = {
  name: string;
  muscleGroups?: string[];
};

type WorkoutPlan = {
  title: string;
  description: string;
  weeklySchedule: { day: number; exercises?: Exercise[] }[];
};

type FatigueData = Record<string, number>;

function updateFatigueLevels(completedExercises: Exercise[]) {
  if (typeof window === 'undefined') return;

  const fatigueString = localStorage.getItem(FATIGUE_STORAGE_KEY);
  let fatigueData: FatigueData = fatigueString ? JSON.parse(fatigueString) : {};

  const trainedMuscles = new Set<string>();
  completedExercises.forEach(exercise => {
    exercise.muscleGroups?.forEach(muscle => trainedMuscles.add(muscle.toLowerCase()));
  });

  // Reset fatigue for all muscles, then apply fatigue for trained ones
  Object.keys(fatigueData).forEach(muscle => {
     fatigueData[muscle] = Math.max(0, (fatigueData[muscle] || 0) - 15); // Daily recovery
  });

  trainedMuscles.forEach(muscle => {
    const currentFatigue = fatigueData[muscle] || 0;
    // Increase fatigue, but cap at 100
    fatigueData[muscle] = Math.min(100, currentFatigue + 50);
  });

  localStorage.setItem(FATIGUE_STORAGE_KEY, JSON.stringify(fatigueData));
}

export function saveCompletedWorkoutAction(title: string, completedExerciseNames: string[]) {
  if (typeof window === 'undefined') return;
  
  const newWorkout: CompletedWorkout = {
    title,
    date: new Date().toISOString(),
  };

  const existingWorkouts = getCompletedWorkouts();
  const updatedWorkouts = [...existingWorkouts, newWorkout];
  localStorage.setItem(WORKOUT_LOG_STORAGE_KEY, JSON.stringify(updatedWorkouts));

  // Update fatigue levels
  const planString = localStorage.getItem(LATEST_WORKOUT_PLAN_KEY);
  if (planString) {
    const plan: WorkoutPlan = JSON.parse(planString);
    const allExercises = plan.weeklySchedule.flatMap(day => day.exercises || []);
    const completedExercises = allExercises.filter(ex => completedExerciseNames.includes(ex.name));
    updateFatigueLevels(completedExercises);
  }

  // Dispatch a storage event to notify other tabs/windows
  window.dispatchEvent(new Event('storage'));
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  const log = localStorage.getItem(WORKOUT_LOG_STORAGE_KEY);
  return log ? JSON.parse(log) : [];
}
