import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "../services/authContext";
import Constants from 'expo-constants';

export default function Index() {
  const { session } = useSession();
  const [serverReady, setServerReady] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const API_URL = Constants.expoConfig.extra.EXPO_PUBLIC_API;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const wakeUpServer = async () => {
      try {
        await fetch(API_URL +"/home");
        setServerReady(true);
      } catch {
        console.log("Wake up failed, retrying…");
      }
    };

    wakeUpServer();

    interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 5, 0));
      wakeUpServer();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (serverReady) {
    if (session) return <Redirect href="/home" />;
    return <Redirect href="/login" />;
  }

  // Splash screen
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Waking up server…</Text>
      <Text style={{ marginTop: 10 }}>
        {countdown} seconds remaining
      </Text>
    </View>
  );
}
