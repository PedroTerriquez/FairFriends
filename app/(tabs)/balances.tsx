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
            total={balance.total}
            name={balance.name}
            status={balance.status}
            members={balance.balance_members}
            myTotal={balance.my_total}
      />
    ))
  }

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <ScrollView style={baseStyles.viewContainerFull}>
        {renderBalances()}
    </ScrollView>
  );
}