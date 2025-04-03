import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import baseStyles from "./BaseStyles";
import AvatarInfoHeader from "./AvatarInfoHeader";

export default BalanceCard = ({ id, counterpart, name1, name2, total1, total2 }) => {
  const data = [
    { 
      name: `${name1}\n has paid $${total1 || 0}\n`, 
      population: total1 || 1, 
      color: "#2F66FF", 
      legendFontColor: "black", 
      legendFontSize: 13 
    },
    { 
      name: `${name2}\n has paid $${total2 || 0}\n`, 
      population: total2 || 1, 
      color: "#7ECC10", 
      legendFontColor: "black", 
      legendFontSize: 13 
    },
  ];
  const navigation = useNavigation();
  const lessPaid = total1 > total2 ? name2 : name1;
  const difference = total1 > total2 ? total1 - total2 : total2 - total1;

  return (
    <TouchableOpacity style={baseStyles.card} onPress={() => navigation.navigate("balance", { paymentable_id: id })}>
      <AvatarInfoHeader user={counterpart} text={`Balance with ${counterpart}`} />
      <PieChart
        data={data}
        width={Dimensions.get("window").width - 40}
        height={100}
        chartConfig={{
          backgroundColor: "transparent",
          color: () => "#000",
          decimalPlaces: 0,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft={"-50"}
        center={[50, 0]}
        absolute
      />
      <View style={[baseStyles.center, { marginTop: 5 }]}>
        { total1 == total2 ? <Text>Friendship in balance</Text> : <Text>{lessPaid} need to pay {difference}</Text> }
      </View>
    </TouchableOpacity>
  );
};