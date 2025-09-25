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
      style={[baseStyles.card, { flexDirection: 'row', alignItems: 'center', minWidth: 200 }]}
      onPress={() => router.push({ pathname: 'balance', params: { id } })}
    >
      <View style={baseStyles.leftSection}>
        <Avatar name={name || '.'}></Avatar>
      </View>
      <View style={{ flexDirection: "column", marginLeft: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[baseStyles.blackBG, baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10 }]}>Avg</Text>
          <Text style={[baseStyles.title17, baseStyles.boldText]}>{formatMoney(avg)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10, backgroundColor: difference >= 0 ? 'green' : '#dc3545'  }]}>You</Text>
          <Text style={[baseStyles.title17, { color: difference >= 0 ? 'green' : '#dc3545' }]}>{formatMoney(myTotal)}</Text>
          <AntDesign
            name={difference >= 0 ? "caretup" : "caretdown"}
            size={20}
            color={difference >= 0 ? "green" : "#dc3545"}
            style={{ marginLeft: 5 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
