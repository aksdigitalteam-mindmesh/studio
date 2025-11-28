import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/generate-diet-plan.ts';
import '@/ai/flows/generate-recovery-tips.ts';
