import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import baseStyles from "./BaseStyles";
import Avatar from "./Avatar";

export default BalanceCard = ({ id, counterpart, name1, name2, total1, total2 }) => {
  const data = [
    { name: name1, population: total1 || 1, color: "#2F66FF", legendFontColor: "black", legendFontSize: 14 },
    { name: name2, population: total2 || 1, color: "#7ECC10", legendFontColor: "black", legendFontSize: 14 },
  ];
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={baseStyles.card} onPress={() => navigation.navigate("balance", { paymentable_id: id })}>
      <View style={baseStyles.center}>
        <Avatar name={counterpart[0] }/>
        <View style={baseStyles.marginLeft}>
          <Text style={baseStyles.label}>Balance with {counterpart}</Text>
        </View>
      </View>
      <PieChart
        data={data}
        width={Dimensions.get("window").width - 40}
        height={120}
        chartConfig={{
          backgroundColor: "transparent",
          color: () => "#000",
          decimalPlaces: 0,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </TouchableOpacity>
  );
};

const styles = {
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
};