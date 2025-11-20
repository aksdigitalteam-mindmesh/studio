import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/generate-diet-plan.ts';
// import '@/ai/flows/generate-exercise-media.ts'; // Disabled as it uses a Google-specific model
import '@/ai/flows/generate-recovery-tips.ts';
