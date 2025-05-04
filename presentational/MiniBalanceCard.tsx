import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import baseStyles from "./BaseStyles";

export default MiniBalanceCard = ({ id, total, name, members, myTotal }) => {
  const navigation = useNavigation();
  const avg = total / members;
  const difference = myTotal - avg;

  return (
    <TouchableOpacity
      key={id}
      style={[baseStyles.card, baseStyles.viewRow, baseStyles.marginLeft5, {height: 10}]}
      onPress={() => navigation.navigate("balance", { paymentable_id: id })}
    >
      <Text style={[baseStyles.cardTitle]}>{name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
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
