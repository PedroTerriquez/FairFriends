import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { getColorHex } from "../services/getColorHex";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTranslation } from 'react-i18next';

export default function PromiseCard({ id, title, percentage, user, status, total, paid_amount, interest }) {
  const router = useRouter();
  const { t } = useTranslation();

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

      <View style={baseStyles.rowSpaceBetween}>
        <View style={{ flex: 1, alignItems: 'flex-start', minWidth: 0 }}>
          <View style={{ alignItems: 'center' }}>
            <Avatar name={user} />
            <Text style={[baseStyles.cardTitle, { textAlign: 'center' }]} numberOfLines={1} ellipsizeMode="tail">{user}</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <CircularProgress
            value={percentage}
            radius={30}
            duration={1500}
            progressValueColor={getColorHex(percentage)}
            maxValue={100}
            title={`%`}
            titleColor={getColorHex(percentage)}
            titleStyle={{ fontWeight: 'bold', fontSize: 12 }}
            activeStrokeColor={getColorHex(percentage)}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {status == 'pending' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightOrangeBG]}>
            <MaterialIcons name="edit" size={20} color="orange" />
            <Text style={[baseStyles.label14, baseStyles.textGray, { color: 'orange', marginLeft: 5 }]}>{t('promiseCard.editable')}</Text>
          </Pressable>
          }
          {status == 'accepted' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightBlueBG]}>
            <MaterialIcons name="moving" size={20} color="blue" />
            <Text style={[baseStyles.label14, baseStyles.textGray, { color: 'blue', marginLeft: 5 }]}>{t('promiseCard.open')}</Text>
          </Pressable>
          }
          {status == 'close' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightGreenBG]}>
            <MaterialIcons name="check" size={20} color="green" />
            <Text style={[baseStyles.label14, baseStyles.textGray, { color: 'green', marginLeft: 5 }]}>{t('promiseCard.finished')}</Text>
          </Pressable>
          }
          {status == 'rejected' && <Pressable style={[baseStyles.floatingBadgeForCard, baseStyles.lightRedBG]}>
            <MaterialIcons name="cancel" size={20} color="red" />
            <Text style={[baseStyles.label14, baseStyles.textGray, { color: 'red', marginLeft: 5 }]}>{t('promiseCard.rejected')}</Text>
          </Pressable>
          }
        </View>
      </View>
      <View>
          <Text style={[baseStyles.title17, baseStyles.textCenter, { marginTop: 25, marginBottom: 10, color: 'black' }]}>{title}</Text>
      </View>
      <View style={[baseStyles.rowCenter, { marginTop: 20, gap: 20 }]}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <MaterialIcons name="attach-money" size={18} color="#333" />
          <Text style={baseStyles.title20}>{total}</Text>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>{t('promiseCard.total')}</Text>
        </View>

        <View style={{ width: 1, height: 56, backgroundColor: 'rgba(0,0,0,0.06)' }} />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <MaterialIcons name="payment" size={18} color="#333" />
          <Text style={baseStyles.title20}>{paid_amount}</Text>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>{t('promiseCard.paid')}</Text>
        </View>

        <View style={{ width: 1, height: 56, backgroundColor: 'rgba(0,0,0,0.06)' }} />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <MaterialIcons name="percent" size={18} color="#333" />
          <Text style={baseStyles.title20}>{interest}</Text>
          <Text style={[baseStyles.label14, baseStyles.textGray]}>{ t('promiseCard.interest')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}