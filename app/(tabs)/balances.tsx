import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { useSession } from "@/services/authContext";
import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";

export default function Balances() {
  const [balances, setBalances] = useState([])
  const { session } = useSession();

  const fetchBalances = async () => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/balances`, session)
      .then((response) => {
        console.log(response)
        setBalances(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  
  const renderBalances = () => {
    if (balances.length == 0) return EmptyList("No balances")

    return balances.map(balance => (
      <BalanceCard
            id={balance.id}
            key={balance.id}
            user1={balance.user1_id}
            user2={balance.user2_id}
            name1={balance.user1_name}
            name2={balance.user2_name}
            total1={balance.user1_money}
            total2={balance.user2_money}
            counterpart={balance.counterpart}
            percentage1={balance.percetage1}
            percentage2={balance.percetage2}
      />
    ))
  }

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <ScrollView style={baseStyles.viewContainer}>
        {renderBalances()}
    </ScrollView>
  );
}