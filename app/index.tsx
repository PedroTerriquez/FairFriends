import { Redirect, Stack } from 'expo-router';
import { useSession } from '../services/authContext';

export default function Index() {
  const { session } = useSession();

  console.log('session')
  console.log(session)
  console.log('session')
  if (session) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}

