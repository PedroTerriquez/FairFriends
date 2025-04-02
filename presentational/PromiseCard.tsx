import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import PromiseGraph from "./PromiseGraph";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";

export default function PromiseCard({ id, title, percentage, user, status }) {
  const router = useRouter();

  const getColorHex = (value) => {
    let color;

    switch (true) {
      case (value <= 20):
        color = '#FF6F61';
        break;
      case (value <= 40):
        color = '#FFB84D';
        break;
      case (value <= 60):
        color = '#F2E205';
        break;
      case (value <= 80):
        color = '#A8D08D';
        break;
      case (value <= 100):
        color = '#4caf50';
        break;
      default:
        color = '#FF6F61';
    }

    return color;
  };

  return (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: "/promise", params: { paymentable_id: id } })}
      style={baseStyles.card}
    >
      {status == 'pending' && <Pressable style={baseStyles.floatingIconForCard}>
        <MaterialIcons name="warning" size={20} color="#d72525" />
        <Text style={baseStyles}>Edit</Text>
      </Pressable>
      }
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.center}>
          <Avatar name={user}/>
          <Text style={baseStyles.label}>{title}</Text>
          <Text style={{ color: "#666" }}>{user} - {percentage}</Text>
        </View>
      </View>
      <PromiseGraph percentage={percentage} />
    </TouchableOpacity>
  );
}