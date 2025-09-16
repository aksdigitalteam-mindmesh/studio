
"use client";

// These are client-side actions that interact with localStorage
const WORKOUT_LOG_STORAGE_KEY = 'completedWorkouts';

type CompletedWorkout = {
  title: string;
  date: string;
};

export function saveCompletedWorkoutAction(title: string) {
  if (typeof window === 'undefined') return;
  const newWorkout: CompletedWorkout = {
    title,
    date: new Date().toISOString(),
  };
  const existingWorkouts = getCompletedWorkouts();
  const updatedWorkouts = [...existingWorkouts, newWorkout];
  localStorage.setItem(WORKOUT_LOG_STORAGE_KEY, JSON.stringify(updatedWorkouts));
  // Dispatch a storage event to notify other tabs/windows
  window.dispatchEvent(new Event('storage'));
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  const log = localStorage.getItem(WORKOUT_LOG_STORAGE_KEY);
  return log ? JSON.parse(log) : [];
}
