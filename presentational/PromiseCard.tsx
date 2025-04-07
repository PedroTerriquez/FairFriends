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
        baseStyles.card,
        status === 'pending' ? baseStyles.cardPending : 
        status === 'close' ? baseStyles.cardClose :
        status === 'accepted' ? baseStyles.cardAccepted : null
      ]}
    >
      {status == 'pending' && <Pressable style={baseStyles.floatingIconForCard}>
        <MaterialIcons name="edit" size={20} color="orange" />
        <Text style={baseStyles.email}>Pending</Text>
      </Pressable>
      }
      {status == 'accepted' && <Pressable style={baseStyles.floatingIconForCard}>
        <MaterialIcons name="edit" size={20} color="green" />
        <Text style={baseStyles.email}>Open</Text>
      </Pressable>
      }
      {status == 'close' && <Pressable style={baseStyles.floatingIconForCard}>
        <MaterialIcons name="close" size={20} color="red" />  
        <Text style={baseStyles.email}>Closed</Text>
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