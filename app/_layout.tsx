import { Stack } from 'expo-router/stack';
import { SessionProvider } from '../services/authContext';
import { ToastProvider } from '@/services/ToastContext';
import { ServerProvider } from '../services/serverContext';
import CustomHeader from '../presentational/CustomHeader';


export default function Root() {
  return (
    <ServerProvider>
      <SessionProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              header: () => <CustomHeader />,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="contactRequests" />
            <Stack.Screen name="addContact" />
            <Stack.Screen name="balance" />
            <Stack.Screen name="promise" />
            <Stack.Screen name="formPayment" />
            <Stack.Screen name="formPromise" />
          </Stack>
        </ToastProvider>
      </SessionProvider>
    </ServerProvider>
  );
}
