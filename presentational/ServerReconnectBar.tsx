import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";

export default function ServerReconnectBar({ serverReady, serverLoading, duration = 70 }: { serverReady: boolean; serverLoading: boolean; duration?: number }) {
  const [reconnectProgress, setReconnectProgress] = useState(duration);

  useEffect(() => {
    if (!serverReady) {
      const interval = setInterval(() => {
        setReconnectProgress((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [serverReady]);

  return (
    <View style={[baseStyles.card, { padding: 10 }]}>  
      <Text style={[baseStyles.redText, { marginBottom: 10 }]}>  
        <MaterialCommunityIcons name="connection" />
        {serverLoading
          ? ` Waking up server… (${reconnectProgress}s)`
          : ` Retrying connection… (${reconnectProgress}s)`}
      </Text>
      <View style={{ height: 4, backgroundColor: '#e0e0e0', width: '100%' }}>
        <View
          style={{
            height: '100%',
            backgroundColor: '#ff0000',
            width: `${(1 - reconnectProgress / duration) * 100}%`,
          }}
        />
      </View>
    </View>
  );
}
