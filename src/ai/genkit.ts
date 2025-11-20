
import {genkit} from 'genkit';
import {firebase} from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    firebase(),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
