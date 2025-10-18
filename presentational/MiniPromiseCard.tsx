import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";
import { getColorHex } from "@/services/getColorHex";
import Avatar from "./Avatar";
import PromiseGraph from "./PromiseGraph";

export default function MiniPromiseCard({ id, name, paidAmount, total })  {
  const percentage = (paidAmount / total * 100);

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, { flexDirection: 'column', gap: 10, minWidth: 160 }]}
      onPress={() => router.push({ pathname: 'promise', params: { id } })}
    >
      <View style={[{ gap: 5, marginTop: 10, flexDirection: 'row',justifyContent: 'flex-start'}]}>
        <Avatar name={name || '.'} size={20}></Avatar>
        <Text> {name.length > 12 ? name.slice(0, 12) + "…" : name}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', gap: 5 }}>
        <Text style={[baseStyles.title26, { paddingBottom: 5, color: getColorHex(percentage) }]} > {percentage}% </Text>
      </View>
      <PromiseGraph percentage={percentage} />
      <View style={{ flex: 1, alignItems: 'center', gap: 5 }}>
        <Text style={[baseStyles.title15, baseStyles.textCenter]}>${paidAmount} / ${total}</Text>
      </View>
    </TouchableOpacity>
  );
};
