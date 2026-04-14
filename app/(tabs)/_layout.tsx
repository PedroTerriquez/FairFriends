import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useSession } from '../../services/authContext';
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
  const { session, loading } = useSession();
  const { t } = useTranslation();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: t("layout.home"),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="contactsIndex"
        options={{
          title: t("layout.contacts"),
          tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="balancesIndex"
        options={{
          title: t("layout.fair_split"),
          tabBarIcon: ({ color, size }) => <FontAwesome name="balance-scale" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="promisesIndex"
        options={{
          title: t("layout.promises"),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="attach-money" color={color} size={size} />,
          headerShown: false
        }}
      />
    </Tabs>
    );
}
