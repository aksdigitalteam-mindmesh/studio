
/**
 * Comprehensive ExerciseDB ID mapping
 * Source: ExerciseDB API - https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
 */

export const EXERCISE_IDS: Record<string, string> = {
  // CHEST
  'bench press': '0025',
  'barbell bench press': '0025',
  'incline bench press': '0348',
  'decline bench press': '0118',
  'dumbbell bench press': '0223',
  'chest fly': '0074',
  'dumbbell fly': '0223',
  'cable crossover': '0859',
  'push-ups': '0662',
  'pushup': '0662',
  'dips': '0176',
  'chest dips': '0176',
  'pec deck': '0580',
  
  // BACK
  'deadlift': '0107',
  'barbell deadlift': '0107',
  'pull-ups': '0651',
  'pullup': '0651',
  'lat pulldown': '0362',
  'seated row': '0703',
  'cable row': '0703',
  'barbell row': '0046',
  'bent over row': '0046',
  'dumbbell row': '0289',
  'single arm row': '0289',
  't-bar row': '0754',
  'face pull': '0272',
  'hyperextension': '0344',
  'back extension': '0344',
  
  // SHOULDERS
  'shoulder press': '0713',
  'overhead press': '0563',
  'military press': '0563',
  'dumbbell shoulder press': '0311',
  'lateral raise': '0365',
  'side lateral raise': '0365',
  'front raise': '0270',
  'rear delt fly': '0667',
  'face pulls': '0272',
  'arnold press': '0011',
  'upright row': '0816',
  
  // LEGS - QUADS
  'squats': '0546',
  'barbell squat': '0546',
  'back squat': '0546',
  'front squat': '0283',
  'leg press': '0378',
  'leg extension': '0379',
  'lunges': '0421',
  'walking lunges': '0421',
  'bulgarian split squat': '0055',
  'split squat': '0055',
  'hack squat': '0321',
  'goblet squat': '0301',
  
  // LEGS - HAMSTRINGS
  'leg curl': '0375',
  'lying leg curl': '0375',
  'seated leg curl': '0704',
  'romanian deadlift': '0690',
  'stiff leg deadlift': '0690',
  'good morning': '0305',
  'nordic curl': '0537',
  
  // LEGS - GLUTES
  'hip thrust': '0335',
  'barbell hip thrust': '0335',
  'glute bridge': '0297',
  'cable kickback': '0849',
  'glute kickback': '0849',
  
  // LEGS - CALVES
  'calf raise': '0057',
  'standing calf raise': '0057',
  'seated calf raise': '0701',
  'donkey calf raise': '0188',
  
  // ARMS - BICEPS
  'bicep curl': '0030',
  'barbell curl': '0030',
  'dumbbell curl': '0238',
  'hammer curl': '0322',
  'preacher curl': '0643',
  'cable curl': '0849',
  'concentration curl': '0096',
  'spider curl': '0728',
  '21s': '0001',
  
  // ARMS - TRICEPS
  'tricep dips': '0756',
  'tricep pushdown': '0769',
  'cable pushdown': '0769',
  'overhead extension': '0565',
  'tricep extension': '0765',
  'skull crusher': '0723',
  'close grip bench': '0091',
  'diamond pushup': '0175',
  'kickback': '0358',
  
  // CORE - ABS
  'plank': '0648',
  'front plank': '0648',
  'side plank': '0719',
  'sit-ups': '0720',
  'situp': '0720',
  'crunches': '0101',
  'crunch': '0101',
  'bicycle crunch': '0029',
  'reverse crunch': '0681',
  'leg raise': '0382',
  'hanging leg raise': '0327',
  'mountain climber': '0527',
  'russian twist': '0691',
  'ab wheel': '0003',
  'cable crunch': '0851',
  'dragon flag': '0189',
  
  // CORE - LOWER BACK
  'superman': '0744',
  'bird dog': '0034',
  
  // CARDIO
  'burpees': '0054',
  'burpee': '0054',
  'jumping jacks': '0355',
  'high knees': '0332',
  'butt kicks': '0056',
  'box jumps': '0050',
  'jump rope': '0356',
  'battle ropes': '0021',
  
  // OLYMPIC LIFTS
  'clean and jerk': '0089',
  'power clean': '0638',
  'hang clean': '0324',
  'snatch': '0724',
  'clean': '0089',
  
  // BODYWEIGHT
  'pull up': '0651',
  'chin up': '0075',
  'dip': '0176',
  'push up': '0662',
  'squat': '0546',
  'lunge': '0421',
  'step up': '0737',
  
  // FUNCTIONAL
  'farmers walk': '0273',
  'sled push': '0721',
  'tire flip': '0763',
  'kettlebell swing': '0357',
  'turkish get up': '0809',
  'wall ball': '0831',
  'thrusters': '0759',
};

/**
 * Get exercise ID by name (case-insensitive, flexible matching)
 */
export function getExerciseId(exerciseName: string): string {
  const normalizedName = exerciseName.toLowerCase().trim();
  
  // Direct match
  if (EXERCISE_IDS[normalizedName]) {
    return EXERCISE_IDS[normalizedName];
  }
  
  // Partial match (e.g., "dumbbell press" matches "dumbbell bench press")
  for (const [key, id] of Object.entries(EXERCISE_IDS)) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return id;
    }
  }
  
  // No match found - return placeholder
  return '0001';
}

/**
 * Get all available exercises for AI context
 */
export function getExerciseListForAI(): string {
  return Object.entries(EXERCISE_IDS)
    .map(([name, id]) => `${name}: ${id}`)
    .join('\n');
}
