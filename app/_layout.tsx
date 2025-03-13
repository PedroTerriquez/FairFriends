import { Slot } from "expo-router";
import { SessionProvider } from '../services/authContext';

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
