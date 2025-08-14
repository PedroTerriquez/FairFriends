import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";
import Avatar from "./Avatar";

export default MiniBalanceCard = ({ id, total, name, members, myTotal }) => {
  const avg = total / members;
  const difference = myTotal - avg;

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, baseStyles.rowCenter, baseStyles.marginLeft5, {height: 0}]}
      onPress={() => router.push({pathname: 'balance', params: { id }})}
    >
      <View style={[baseStyles.rowCenter, { gap: 5 }]}>
        <Avatar name={name || '.'}></Avatar>
        <Text
          style={[
            baseStyles.titleBold40,
            { color: difference >= 0 ? "green" : "#dc3545" },
          ]}
        >
          ${Math.abs(myTotal)}
        </Text>
        <AntDesign
          name={difference >= 0 ? "caretup" : "caretdown"}
          size={24}
          color={difference >= 0 ? "green" : "#dc3545"}
          style={{ marginLeft: 5 }}
        />
      </View>
    </TouchableOpacity>
  );
};
