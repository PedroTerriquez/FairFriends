import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons
import baseStyles from "./BaseStyles";

export default BalanceCard = ({ id, total, name, status, members, myTotal }) => {

  const getColorByIndex = (index) => {
    const professionalColors = [
      "#4F81BD", // Blue
      "#9BBB59", // Green
      "#F79646", // Orange
      "#C0504D", // Red
      "#4BACC6", // Cyan
      "#F2C314", // Yellow
      "#8064A2", // Purple
      "#92A9CF", // Light Blue
      "#A2D39C", // Light Green
      "#FFB97B", // Peach
    ];
    return professionalColors[index % professionalColors.length];
  };

  const data = members.map((member, index) => ({
    name: `${member.name}\n`,
    population: member.money || 1,
    color: getColorByIndex(index),
    legendFontColor: "black",
    legendFontSize: 11
  }));

  const navigation = useNavigation();
  const membersWithMoney = members.map(member => ({
    name: member.name,
    money: member.money || 0
  }));

  const minPaidMember = membersWithMoney.reduce((min, current) => 
    current.money < min.money ? current : min
  );

  const lessPaid = minPaidMember.name;
  const avg = total / members.length;
  const difference = myTotal - avg;

  return (
    <TouchableOpacity key={id}  style={[baseStyles.card]} onPress={() => navigation.navigate("balance", { paymentable_id: id })}>
      <Text style={[baseStyles.cardTitle]}>{members.length > 2 ? name : `Extra large title Balance with ${name}`}</Text>
      <View style={[baseStyles.viewRow, {paddingVertical: 5}]}>
        <View style={{ flex: 2, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[baseStyles.bigNumber, { color: difference >= 0 ? 'green' : '#dc3545' }]}>
              ${Math.abs(myTotal)}
            </Text>
            <AntDesign
              name={difference >= 0 ? "caretup" : "caretdown"}
              size={24}
              color={difference >= 0 ? "green" : "#dc3545"}
              style={{ marginLeft: 5 }}
            />
          </View>
          <Text style={[baseStyles.smallLabel]}>Split Avg: $<Text style={{ fontWeight: 'bold' }}>{avg}</Text></Text>
          <Text style={[baseStyles.smallLabel]}>Split Total: $<Text style={{ fontWeight: 'bold' }}>{total}</Text></Text>
          <View style={[baseStyles.viewRow, { marginTop: 20 }]}>
            <Text style={[baseStyles.label, baseStyles.backgroundRed, { borderRadius: 10, paddingHorizontal: 10 }]}>Next on: <Text style={[baseStyles.boldText]}>{lessPaid}</Text></Text>
          </View>
        </View>
        <View style={[baseStyles.viewContainerFullOnly, { flex: 3 }]}>
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 180}
            height={130}
            chartConfig={{
              color: () => "black",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute={false}
            center={[-5, 0]}
          >
          </PieChart>
        </View>
      </View>
    </TouchableOpacity>
  );
};