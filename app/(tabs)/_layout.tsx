import { Text } from 'react-native';
import { Redirect, Stack, Tabs } from 'expo-router';
import { useSession } from '../../services/authContext';
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function AppLayout() {
  const { session } = useSession();

  if (session == null) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  //TODO: Probably remove bottom margin I added here
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { marginBottom: 10 }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="balances"
        options={{
          title: "Fair Split",
          tabBarIcon: ({ color, size }) => <FontAwesome name="balance-scale" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="promises"
        options={{
          title: "Promises",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="attach-money" color={color} size={size} />,
          headerShown: false
        }}
      />
    </Tabs>
    );
}
