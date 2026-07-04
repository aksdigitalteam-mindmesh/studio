
"use client";

// These are client-side actions that interact with localStorage
const WORKOUT_LOG_STORAGE_KEY = 'completedWorkouts';
const FATIGUE_STORAGE_KEY = 'muscleFatigueData';
const LAST_RECOVERY_KEY = 'lastFatigueRecoveryDate';

type CompletedWorkout = {
  title: string;
  date: string;
};

type SaveWorkoutPayload = {
    title: string;
    muscleGroups: string[];
    fatigueRating: 'low' | 'medium' | 'high';
};

type FatigueData = Record<string, number>;

const FATIGUE_INCREASE = {
    low: 30,
    medium: 50,
    high: 70
};

/**
 * Updates muscle fatigue levels based on the workout performed.
 * Also handles daily 15% recovery for all muscles.
 */
function updateFatigueLevels(payload: SaveWorkoutPayload) {
  if (typeof window === 'undefined') return;

  const fatigueString = localStorage.getItem(FATIGUE_STORAGE_KEY);
  let fatigueData: FatigueData = fatigueString ? JSON.parse(fatigueString) : {};

  // 1. Handle Automatic Recovery (once per day)
  const today = new Date().toDateString();
  const lastRecovery = localStorage.getItem(LAST_RECOVERY_KEY);
  
  if (lastRecovery !== today) {
    Object.keys(fatigueData).forEach(muscle => {
       fatigueData[muscle] = Math.max(0, (fatigueData[muscle] || 0) - 15);
    });
    localStorage.setItem(LAST_RECOVERY_KEY, today);
  }

  // 2. Apply New Fatigue for trained muscles
  const trainedMuscles = new Set(payload.muscleGroups.map(m => m.toLowerCase().trim()));

  trainedMuscles.forEach(muscle => {
    const currentFatigue = fatigueData[muscle] || 0;
    const increase = FATIGUE_INCREASE[payload.fatigueRating];
    // Increase fatigue, but cap at 100
    fatigueData[muscle] = Math.min(100, currentFatigue + increase);
  });

  localStorage.setItem(FATIGUE_STORAGE_KEY, JSON.stringify(fatigueData));
}

export function saveCompletedWorkoutAction(payload: SaveWorkoutPayload) {
  if (typeof window === 'undefined') return;
  
  const newWorkout: CompletedWorkout = {
    title: payload.title,
    date: new Date().toISOString(),
  };

  const existingWorkouts = getCompletedWorkouts();
  const updatedWorkouts = [...existingWorkouts, newWorkout];
  localStorage.setItem(WORKOUT_LOG_STORAGE_KEY, JSON.stringify(updatedWorkouts));

  // Update fatigue levels based on the payload
  updateFatigueLevels(payload);

  // Dispatch a storage event to notify other tabs/windows and the current window
  window.dispatchEvent(new Event('storage'));
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === 'undefined') return [];
  const log = localStorage.getItem(WORKOUT_LOG_STORAGE_KEY);
  try {
    return log ? JSON.parse(log) : [];
  } catch {
    return [];
  }
}
