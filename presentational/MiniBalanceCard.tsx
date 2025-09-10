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
      style={[baseStyles.card, { flexDirection: 'row',alignItems: 'center', minWidth: 200 }]}
      onPress={() => router.push({pathname: 'balance', params: { id }})}
    >
      <View style={baseStyles.leftSection}>
        <Avatar name={name || '.'}></Avatar>
      </View>
      <View style={[baseStyles.rightSection, {alignItems: 'center'}]}>
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
        />
      </View>
    </TouchableOpacity>
  );
};
