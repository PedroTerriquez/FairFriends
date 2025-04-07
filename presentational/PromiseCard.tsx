import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import PromiseGraph from "./PromiseGraph";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";

export default function PromiseCard({ id, title, percentage, user, status }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: "/promise", params: { paymentable_id: id } })}
      style={[
        baseStyles.card, status == 'pending' ? baseStyles.cardPending : null,
      ]}
    >
      {status == 'pending' && <Pressable style={baseStyles.floatingIconForCard}>
        <MaterialIcons name="edit" size={20} color="orange" />
        <Text style={baseStyles.email}>Pending</Text>
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