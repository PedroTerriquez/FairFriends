import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import PromiseGraph from "./PromiseGraph";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";

export default function PromiseCard({ id, title, percentage, user, status, total }) {
  const router = useRouter();
  const cleanTotal = total ? total.toString().replace(/[^0-9.]/g, '') : 0;

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
      {status == 'pending' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.backgroundOrange]}>
        <MaterialIcons name="edit" size={20} color="orange" />
        <Text style={[baseStyles.textGray14, {color: 'orange', marginLeft: 5}]}>Editable</Text>
      </Pressable>
      }
      {status == 'accepted' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.backgroundGreen]}>
        <MaterialIcons name="check" size={20} color="green" />
        <Text style={[baseStyles.textGray14, {color: 'green', marginLeft: 5}]}>Open</Text>
      </Pressable>
      }
      {status == 'close' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.backgroundRed]}>
        <MaterialIcons name="close" size={20} color="red" />  
        <Text style={[baseStyles.textGray14, {color: 'red', marginLeft: 5}]}>Closed</Text>
      </Pressable>
      }
      <View style={baseStyles.viewRow}>
        <Avatar name={user} />
        <Text style={[baseStyles.cardTitle, baseStyles.marginLeft]}>{user}</Text>
      </View>
      <Text style={baseStyles.bigNumber}>${cleanTotal}</Text>
      <Text style={baseStyles.textGray14}>{title}</Text>
      <PromiseGraph percentage={percentage} />
    </TouchableOpacity>
  );
}