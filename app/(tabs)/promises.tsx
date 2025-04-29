import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSession } from "@/services/authContext";
import PromiseCard from '../../presentational/PromiseCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";

export default function Promises() {
  const [receiving , setReceiving] = useState([])
  const [paying, setPaying] = useState([])
  const [activeTab, setActiveTab] = useState("Receiving");
  const { session } = useSession();

  const fetchPromises = async () => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/promises`, session)
      .then((response) => {
        console.log(response)
        setReceiving(response.data.my_promises)
        setPaying(response.data.owe_promises)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  
  const renderPromises = (promises) => {
    if (promises.length == 0) return EmptyList("No promises")

    return promises.map(promise => (
      <PromiseCard
            id={promise.id}
            key={promise.id}
            title={promise.title}
            paid_amount={promise.paid_amount}
            total={promise.total}
            percentage={promise.percentage}
            user={promise.user}
            status={promise.status}
      />
    ))
  }

  useEffect(() => {
    fetchPromises();
  }, []);

  return (
    <ScrollView style={baseStyles.viewContainerFull}>
      <View style={ baseStyles.viewRowWithSpace}>
        <Pressable onPress={() => setActiveTab("Receiving")} style={activeTab === "Receiving" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}>
          <Text style={activeTab === "Receiving" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>Receiving</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Paying")} style={activeTab === "Paying" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}>
          <Text style={activeTab === "Paying" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>Paying</Text>
        </Pressable>
      </View>

      {activeTab === "Receiving" ? renderPromises(receiving) : renderPromises(paying)}
    </ScrollView>
  );
}