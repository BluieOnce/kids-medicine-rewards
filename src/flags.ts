import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const testingOn = flag<boolean>({
  key: 'TESTING_ON',
  defaultValue: false,
  adapter: vercelAdapter(),
});
