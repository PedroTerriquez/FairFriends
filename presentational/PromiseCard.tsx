import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import PromiseGraph from "./PromiseGraph";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { getColorHex } from "../services/getColorHex";

export default function PromiseCard({ id, title, percentage, user, status, total, paid_amount, interest }) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: "/promise", params: {  id } })}
      style={[
        baseStyles.card,
        status === 'pending' ? baseStyles.cardPending : 
        status === 'close' ? baseStyles.cardClose :
        status === 'rejected' ? baseStyles.cardRejected :
        status === 'accepted' ? baseStyles.cardAccepted : null
      ]}
    >
      {status == 'pending' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightOrangeBG]}>
        <MaterialIcons name="edit" size={20} color="orange" />
        <Text style={[baseStyles.label14, baseStyles.textGray, {color: 'orange', marginLeft: 5}]}>Editable</Text>
      </Pressable>
      }
      {status == 'accepted' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightBlueBG]}>
        <MaterialIcons name="moving" size={20} color="blue" />
        <Text style={[baseStyles.label14, baseStyles.textGray, {color: 'blue', marginLeft: 5}]}>Open</Text>
      </Pressable>
      }
      {status == 'close' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightGreenBG]}>
        <MaterialIcons name="check" size={20} color="green" />  
        <Text style={[baseStyles.label14, baseStyles.textGray, {color: 'green', marginLeft: 5}]}>Finished</Text>
      </Pressable>
      }
      {status == 'rejected' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightRedBG]}>
        <MaterialIcons name="cancel" size={20} color="red" />
        <Text style={[baseStyles.label14, baseStyles.textGray, {color: 'red', marginLeft: 5}]}>Rejected</Text>
      </Pressable>
      }
      <View style={[baseStyles.rowCenter, {gap: 20, marginTop: 30}]}>
        <View style={baseStyles.columnCenter}>
          <Avatar name={user} />
          <Text style={[baseStyles.cardTitle, {alignSelf: 'center'}]}>{user}</Text>
        </View>
        <View style={{ flex: 1, gap: 10}}>
          <Text style={[baseStyles.label17, baseStyles.textCenter]}>{title}</Text>
        </View>
      </View>
      <View style={[{ marginTop: 20, flexDirection: 'row', gap: 20 }]}>
        <View >
        <View>
          <Text style={[baseStyles.title20]}>{total}</Text>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>Total</Text>
        </View>
        <View>
          <Text style={[baseStyles.title20]}>{interest}%</Text>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>Interest</Text>
        </View></View>
        <View style={{flex: 1}}>
          <Text style={[baseStyles.title32, baseStyles.textCenter, { color: getColorHex(parseInt(percentage)) }]}>${paid_amount}</Text>
          <View style={{ height: 15, justifyContent: 'center' }}>
            <PromiseGraph percentage={percentage} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}