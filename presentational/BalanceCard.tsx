import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import baseStyles from "./BaseStyles";

export default BalanceCard = ({ id, total, name, status, members, myTotal }) => {

  const data = members.map((member, index) => ({
    name: ` - ${member.name}\n`,
    population: member.money || 1,
    color: index === 0 ? "#2F66FF" : "#7ECC10",
    legendFontColor: "black",
    legendFontSize: 13
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
  const difference = myTotal - total/members.length;

  return (
    <TouchableOpacity key={id} style={[baseStyles.card, baseStyles.viewRow]} onPress={() => navigation.navigate("balance", { paymentable_id: id })}>
      <View style={{ flex: 2, justifyContent: "space-between" }}>
        <View style={{marginBottom: 20}}>
          <Text style={[baseStyles.bigNumber, { color: difference >= 0 ? 'green' : '#dc3545' }]}>{difference >= 0 ? '+' : '-'}${Math.abs(difference)}</Text>
          <Text style={[baseStyles.cardTitle]}>{name || "Balance with this user"}</Text>
        </View>
        <View style={[baseStyles.viewRow, { marginTop: 'auto' }]}>
          <Text style={[baseStyles.label, baseStyles.backgroundRed, {borderRadius: 10, paddingHorizontal: 10}]}>Next: <Text style={[baseStyles.boldText]}>{lessPaid}</Text></Text>
        </View>
      </View>
      <View style={[baseStyles.viewContainerFullOnly]}>
        <PieChart
          data={data}
          width={Dimensions.get("window").width}
          height={100}
          chartConfig={{
            backgroundColor: "transparent",
            color: () => "#000",
            decimalPlaces: 0,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft={"-30"}
          center={[0, 0]}
          absolute
        />
        <Text style={[baseStyles.label, { textAlign: "right" }]}>Total: $<Text style={{ fontWeight: 'bold' }}>{total}</Text></Text>
      </View>
    </TouchableOpacity>
  );
};