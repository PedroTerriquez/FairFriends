import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";
import { getColorHex } from "@/services/getColorHex";
import Avatar from "./Avatar";

export default MiniPromiseCard = ({ id, name, paidAmount, total }) => {
  const percentage = (paidAmount / total * 100);

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, baseStyles.rowCenter]}
      onPress={() => router.push({pathname: 'promise', params: { id }})}
    >
      <View style={[baseStyles.rowCenter, { gap: 3 }]}>
        <Avatar name={name || '.'}></Avatar>
        <Text
          style={[
            baseStyles.titleBold40,
            { color: getColorHex(percentage) },
          ]}
        >
          {percentage}%
        </Text>
        <AntDesign
          name={"caretdown"}
          size={24}
          color={ getColorHex(percentage) }
          style={{ marginLeft: 5 }}
        />
      </View>
    </TouchableOpacity>
  );
};
