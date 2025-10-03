import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // Import MaterialIcons
import baseStyles from "./BaseStyles";
import formatMoney from "../services/formatMoney";

export default function BalanceCard({ id, total, name, members, myTotal }) {
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
    <TouchableOpacity key={id}  style={[baseStyles.card]} onPress={() => router.push({pathname: 'balance', params: { id }})}>
      <Text style={[baseStyles.cardTitle]}>{members.length > 2 ? name : `Balance with ${name}`}</Text>
      <View style={[baseStyles.rowCenter]}>
        <View style={{ flex: 2.5, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={[baseStyles.blackBG, baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10 }]}>Avg</Text>
              <Text style={[baseStyles.title24, baseStyles.boldText]}>{formatMoney(avg)}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={[baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10, backgroundColor: difference >= 0 ? 'green' : '#dc3545'  }]}>You</Text>
              <Text style={[baseStyles.title24, { color: difference >= 0 ? 'green' : '#dc3545' }]}>{formatMoney(myTotal)}</Text>
              <AntDesign
                name={difference >= 0 ? "caretup" : "caretdown"}
                size={20}
                color={difference >= 0 ? "green" : "#dc3545"}
                style={{ marginLeft: 5 }}
              />
            </View>
          </View>
          <View style={[{ flexDirection: 'column', marginTop: 10, alignItems: 'center', padding: 5, borderRadius: 10, paddingHorizontal: 5 }, baseStyles.lightRedBG]}>
            <Text style={[baseStyles.smallLabel]}>Next payment on: </Text>
            <Text style={[baseStyles.boldText]}>{lessPaid}</Text>
          </View>
        </View>
        <View style={{ flex: 3.5 }}>
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
