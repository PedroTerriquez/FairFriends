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
      style={[baseStyles.card, { flexDirection: 'column',alignItems: 'center', gap: 10, minWidth: 160 }]}
      onPress={() => router.push({ pathname: 'promise', params: { id } })}
    >
      <View style={[baseStyles.rowCenter]}>
        <Text style={[ baseStyles.title32, { color: getColorHex(percentage) }]} >
          {percentage}%
        </Text>
      </View>
      <View style={[baseStyles.rowCenter, {gap: 10}]}>
        <Avatar name={name || '.'} size={20}></Avatar>
        <Text> {name.length > 12 ? name.slice(0, 12) + "…" : name}</Text>
      </View>
    </TouchableOpacity>
  );
};
