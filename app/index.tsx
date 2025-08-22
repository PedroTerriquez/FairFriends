/* const origError = console.error;
console.error = function (...args) {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Unexpected text node')
  ) {
    throw new Error(args.join(' ')); // force debugger to stop
  }
  origError.apply(console, args);
};
*/

import { Redirect, Stack } from 'expo-router';
import { useSession } from '../services/authContext';

export default function Index() {
  const { session } = useSession();

  if (session) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}

