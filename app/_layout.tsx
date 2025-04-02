import { Stack } from 'expo-router/stack';
import { SessionProvider } from '../services/authContext';

export default function Root() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
