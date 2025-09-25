import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";
import { getColorHex } from "@/services/getColorHex";
import Avatar from "./Avatar";

export default function MiniPromiseCard({ id, name, paidAmount, total })  {
  const percentage = (paidAmount / total * 100);

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, { flexDirection: 'row',alignItems: 'center', gap: 20, minWidth: 200 }]}
      onPress={() => router.push({ pathname: 'promise', params: { id } })}
    >
      <View style={baseStyles.leftSection}>
        <Avatar name={name || '.'}></Avatar>
      </View>
      <View style={[baseStyles.rightSection, {alignItems: 'center'}]}>
        <Text
          style={[
            baseStyles.titleBold40,
            { color: getColorHex(percentage) }]}
        >
          {percentage}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};
