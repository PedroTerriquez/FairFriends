import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import PromiseGraph from "./PromiseGraph";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { getColorHex } from "../services/getColorHex";

export default function PromiseCard({ id, title, percentage, user, status, total, paid_amount }) {
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
      <View style={[baseStyles.rowCenter, {marginBottom: 20}]}>
        <View style={{ flex: 1}}>
          <Text style={[baseStyles.titleBold40, baseStyles.textCenter, { color: getColorHex(parseInt(percentage)) }]}>${paid_amount}</Text>
          <View style={[ baseStyles.rowCenter, { alignContent: 'center', justifyContent: 'center' }]}>
            <Text> 0% </Text>
            <PromiseGraph percentage={percentage} />
            <Text> 100% </Text>
          </View>
        </View>
      </View>
      <Text style={[baseStyles.label14, baseStyles.textCenter]}>{title}</Text>
      <View style={[baseStyles.headerContent, {marginTop: 20}]}>
        <View style={baseStyles.leftSection}>
          <Avatar name={user} />
          <Text style={[baseStyles.cardTitle, baseStyles.marginLeft10, {alignSelf: 'center'}]}>{user}</Text>
        </View>
        <View style={baseStyles.rightSection}>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>Total ${total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}