import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSession } from "@/services/authContext";
import PromiseCard from '../../presentational/PromiseCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";

export default function Promises() {
  const [receivable , setReceivable] = useState([])
  const [payable, setPayable] = useState([])
  const [activeTab, setActiveTab] = useState("Receivable");
  const { session } = useSession();

  const fetchPromises = async () => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/promises`, session)
      .then((response) => {
        console.log(response)
        setReceivable(response.data.my_promises)
        setPayable(response.data.owe_promises)
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
            paid={promise.paid_amount}
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
    <ScrollView style={baseStyles.viewContainer}>
      <View style={ baseStyles.viewBackground}>
        <Pressable onPress={() => setActiveTab("Receivable")}>
          <Text style={{ fontWeight: activeTab === "Receivable" ? "bold" : "normal" }}>Receivable</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Payable")}>
          <Text style={{ fontWeight: activeTab === "Payable" ? "bold" : "normal" }}>Payable</Text>
        </Pressable>
      </View>

      {activeTab === "Receivable" ? renderPromises(receivable) : renderPromises(payable)}
    </ScrollView>
  );
}