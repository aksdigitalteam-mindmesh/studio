
/**
 * Inbuilt directory of workouts categorized by muscle group.
 */

export type InbuiltExercise = {
  name: string;
  muscleGroups: string[];
  equipment: 'with' | 'without';
  difficulty: 'low' | 'medium' | 'high';
  description: string;
  baseSets: number;
  baseReps: string;
};

export const WORKOUT_DATABASE: InbuiltExercise[] = [
  // CHEST
  { name: 'Push-ups', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: 'without', difficulty: 'low', description: 'Standard floor push-ups.', baseSets: 3, baseReps: '12-15' },
  { name: 'Bench Press', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: 'with', difficulty: 'medium', description: 'Barbell bench press on a flat bench.', baseSets: 4, baseReps: '8-10' },
  { name: 'Incline Dumbbell Press', muscleGroups: ['upper chest', 'shoulders'], equipment: 'with', difficulty: 'medium', description: 'Dumbbell press on an inclined bench.', baseSets: 3, baseReps: '10-12' },
  { name: 'Chest Dips', muscleGroups: ['chest', 'triceps'], equipment: 'with', difficulty: 'high', description: 'Bodyweight or weighted dips focusing on the chest.', baseSets: 3, baseReps: '8-12' },
  
  // BACK
  { name: 'Pull-ups', muscleGroups: ['back', 'biceps'], equipment: 'with', difficulty: 'high', description: 'Wide grip pull-ups.', baseSets: 3, baseReps: 'Failure' },
  { name: 'Lat Pulldowns', muscleGroups: ['back', 'biceps'], equipment: 'with', difficulty: 'low', description: 'Cable lat pulldowns.', baseSets: 3, baseReps: '12-15' },
  { name: 'Bent Over Rows', muscleGroups: ['back', 'rear delts'], equipment: 'with', difficulty: 'medium', description: 'Barbell or dumbbell rows.', baseSets: 4, baseReps: '10-12' },
  { name: 'Superman', muscleGroups: ['lower back'], equipment: 'without', difficulty: 'low', description: 'Lying face down, lift arms and legs.', baseSets: 3, baseReps: '15' },
  
  // SHOULDERS
  { name: 'Overhead Press', muscleGroups: ['shoulders', 'triceps'], equipment: 'with', difficulty: 'medium', description: 'Barbell or dumbbell military press.', baseSets: 4, baseReps: '8-12' },
  { name: 'Lateral Raises', muscleGroups: ['shoulders'], equipment: 'with', difficulty: 'low', description: 'Dumbbell side raises.', baseSets: 3, baseReps: '15-20' },
  { name: 'Pike Push-ups', muscleGroups: ['shoulders'], equipment: 'without', difficulty: 'medium', description: 'Hips high push-ups targeting delts.', baseSets: 3, baseReps: '10-12' },
  
  // LEGS - QUADS
  { name: 'Bodyweight Squats', muscleGroups: ['quads', 'glutes'], equipment: 'without', difficulty: 'low', description: 'Standard air squats.', baseSets: 3, baseReps: '20' },
  { name: 'Barbell Squats', muscleGroups: ['quads', 'glutes', 'core'], equipment: 'with', difficulty: 'high', description: 'Back squats with barbell.', baseSets: 4, baseReps: '8-10' },
  { name: 'Lunges', muscleGroups: ['quads', 'glutes'], equipment: 'without', difficulty: 'low', description: 'Alternating forward lunges.', baseSets: 3, baseReps: '12 per leg' },
  
  // LEGS - HAMSTRINGS/GLUTES
  { name: 'Romanian Deadlifts', muscleGroups: ['hamstrings', 'glutes', 'lower back'], equipment: 'with', difficulty: 'medium', description: 'Stiff-leg deadlifts.', baseSets: 3, baseReps: '10-12' },
  { name: 'Glute Bridges', muscleGroups: ['glutes', 'hamstrings'], equipment: 'without', difficulty: 'low', description: 'Lying hip thrusts.', baseSets: 3, baseReps: '15-20' },
  
  // ARMS
  { name: 'Bicep Curls', muscleGroups: ['biceps'], equipment: 'with', difficulty: 'low', description: 'Dumbbell or barbell curls.', baseSets: 3, baseReps: '12-15' },
  { name: 'Tricep Extensions', muscleGroups: ['triceps'], equipment: 'with', difficulty: 'low', description: 'Overhead dumbbell extensions.', baseSets: 3, baseReps: '12-15' },
  { name: 'Diamond Push-ups', muscleGroups: ['triceps', 'chest'], equipment: 'without', difficulty: 'medium', description: 'Close-hand push-ups.', baseSets: 3, baseReps: '10-12' },
  
  // CORE
  { name: 'Plank', muscleGroups: ['abs', 'core'], equipment: 'without', difficulty: 'low', description: 'Forearm plank hold.', baseSets: 3, baseReps: '45-60s' },
  { name: 'Leg Raises', muscleGroups: ['abs'], equipment: 'without', difficulty: 'medium', description: 'Lying leg lifts.', baseSets: 3, baseReps: '15' },
  { name: 'Russian Twists', muscleGroups: ['obliques'], equipment: 'without', difficulty: 'low', description: 'Seated torso rotations.', baseSets: 3, baseReps: '20 per side' },
];
