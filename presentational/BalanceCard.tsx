import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // Import MaterialIcons
import baseStyles from "./BaseStyles";
import formatMoney from "../services/formatMoney";
import { useTranslation } from 'react-i18next';

export default function BalanceCard({ id, total, name, members, myTotal }) {
  const { t } = useTranslation();

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
      <Text style={[baseStyles.cardTitle]}>{members.length > 2 ? name : `${t('balanceCard.balance_with')} ${name}`}</Text>
      <View style={[baseStyles.rowCenter]}>
        <View style={{ flex: 2.5, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={[baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10, backgroundColor: difference >= 0 ? 'green' : '#dc3545'  }]}>{t('balanceCard.you')}</Text>
              <Text style={[baseStyles.title24, { color: difference >= 0 ? 'green' : '#dc3545' }]}>{formatMoney(myTotal)}</Text>
              <AntDesign
                name={difference >= 0 ? "caret-up" : "caret-down"}
                size={20}
                color={difference >= 0 ? "green" : "#dc3545"}
                style={{ marginLeft: 5 }}
              />
            </View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={[baseStyles.blackBG, baseStyles.textWhite, { borderRadius: 10, padding: 5, marginRight: 5, fontSize: 10 }]}>{t('balanceCard.avg')}</Text>
              <Text style={[baseStyles.title24, baseStyles.boldText]}>{formatMoney(avg)}</Text>
            </View>
          </View>
          <View style={[{ flexDirection: 'column', marginTop: 10, alignItems: 'center', padding: 5, borderRadius: 10, paddingHorizontal: 5 }, baseStyles.lightRedBG]}>
            <Text style={[baseStyles.smallLabel]}>{t('balanceCard.next_payment_on')} </Text>
            <Text style={[baseStyles.boldText]}>{lessPaid}</Text>
          </View>
        </View>
        <View style={{ flex: 3.5 }}>
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 200}
            height={100}
            chartConfig={{
              color: () => "black",
            }}
            accessor="population"
            backgroundColor="transparent"
            absolute={false}
            center={[10, 0]}
          >
          </PieChart>
          <View style={{
            flexDirection: "row",
            justifyContent: 'flex-end',
            marginTop: 20
          }}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: 'black',
              paddingBottom: 4,
              gap: 5,
              justifyContent: "flex-end"
            }}>
              <Text style={[baseStyles.textBlack, { textAlign: "right" }]}>{t('balanceCard.total')}:</Text>
              <Text style={[baseStyles.title15, baseStyles.boldText, { textAlign: "right" }]}>{formatMoney(total)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity >
  );
};
