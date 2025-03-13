import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../services/authContext';

export default function AppLayout() {
  const { session } = useSession();

  if (session == null) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
