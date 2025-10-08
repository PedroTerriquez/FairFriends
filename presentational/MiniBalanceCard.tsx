import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";
import Avatar from "./Avatar";
import formatMoney from "@/services/formatMoney";

export default function MiniBalanceCard({ id, total, name, members, myTotal }) {
  const avg = total / members;
  const difference = myTotal - avg;

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, { flexDirection: 'row', alignItems: 'center', minWidth: 160 }]}
      onPress={() => router.push({ pathname: 'balance', params: { id } })}
    >
      <View style={{ flexDirection: "column", gap: 5 }}>
        <View style={ baseStyles.rowCenter }>
          <Text style={[baseStyles.blackBG, baseStyles.textWhite, baseStyles.badge, { marginRight: 5, fontSize: 10 }]}>Avg</Text>
          <Text style={[baseStyles.title17, baseStyles.boldText]}>{formatMoney(avg)}</Text>
        </View>
        <View style={ baseStyles.rowCenter }>
          <Text style={[baseStyles.textWhite, baseStyles.badge, { marginRight: 5, fontSize: 10,
            backgroundColor: difference >= 0 ? baseStyles.postiveValueText?.color : baseStyles.negativeValueText?.color  }]}>You</Text>
          <Text style={[baseStyles.title17, difference >= 0 ? baseStyles.postiveValueText : baseStyles.negativeValueText]}>{formatMoney(myTotal)}</Text>
          <AntDesign
            name={difference >= 0 ? "caretup" : "caretdown"}
            size={20}
            color={ difference >= 0 ? baseStyles.postiveValueText?.color : baseStyles.negativeValueText?.color }
            style={{ marginLeft: 5 }}
          />
        </View>
        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 5 }]}>
          <Avatar name={name || '.'} size={15}></Avatar>
          <Text>{name?.slice(0, 14)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
