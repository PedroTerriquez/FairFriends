import { createContext, useContext, useEffect, useState } from "react";
import Constants from "expo-constants";

const ServerContext = createContext();
export const useServer = () => useContext(ServerContext);

export function ServerProvider({ children }) {
  const [serverReady, setServerReady] = useState(false);
  const [serverLoading, setServerLoading] = useState(true);
  const API_URL = Constants.expoConfig.extra.EXPO_PUBLIC_API;

  useEffect(() => {
    let interval;

    const wakeUpServer = async () => {
      try {
        await fetch(API_URL + "/health");
        setServerReady(true);
        clearInterval(interval);
      } catch {
      } finally {
        setServerLoading(false);
      }
    };

    wakeUpServer();

    interval = setInterval(wakeUpServer, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ServerContext.Provider value={{ serverReady, serverLoading }}>
      {children}
    </ServerContext.Provider>
  );
}
