import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useSession } from "@/services/authContext";
import Person from '@/presentational/Person';
import baseStyles from "@/presentational/BaseStyles";

export default function contactRequests() {
  const [pending, setPending] = useState([])
  const [sent, setSent] = useState([])
  const [activeTab, setActiveTab] = useState("Pending");

  const { session } = useSession();

  const fetchRequests = async () => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/friendships/requests`, session)
      .then((response) => {
        setPending(response.data.pending)
        setSent(response.data.sent)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const cancelRequest = (id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${id}/cancel`, {}, session)
      .then((response) => {
        removeCard(id, 'sent')
      })
      .catch((error) => {
      })
  }

  const rejectRequest = (id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${id}/reject`, {}, session)
      .then((response) => {
        removeCard(id, 'pending')
      })
      .catch((error) => {
      })
  }

  const acceptRequest = (id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${id}/accept`, {}, session)
      .then((response) => {
        removeCard(id, 'pending')
      })
      .catch((error) => {
      })
  }

  const removeCard = (id, type) => {
    if (type == 'sent') {
      const newPeople = sent.filter((person) => person.id !== id)
      setSent(newPeople)
    } else if (type == 'pending') {
      const newPeople = pending.filter((person) => person.id !== id)
      setPending(newPeople)
    }
  }
  
  const renderRequests = (contacts, type) => {
    if (contacts.length == 0) return

    if (type == 'pending') {
      return contacts.map(contact => (
        <Person person={contact} >
          {contact.id && (
            <View style={baseStyles.rowCenter}>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.red]} onPress={() => rejectRequest(contact.id)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.green, baseStyles.marginLeft]} onPress={() => acceptRequest(contact.id)}>
                <MaterialIcons name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          </Person>
      ))
    } else if (type == 'sent') {
      return contacts.map(contact => (
        <Person person={contact} >
          {contact.id && (
            <TouchableOpacity style={baseStyles.circleButton} onPress={() => cancelRequest(contact.id)}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          )}
        </Person>
      ))
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10, backgroundColor: "#eee" }}>
        <Pressable onPress={() => setActiveTab("Pending")}>
          <Text style={{ fontWeight: activeTab === "Pending" ? "bold" : "normal" }}>Pending</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Sent")}>
          <Text style={{ fontWeight: activeTab === "Sent" ? "bold" : "normal" }}>Sent</Text>
        </Pressable>
      </View>

      {activeTab === "Pending" ? renderRequests(pending, 'pending') : renderRequests(sent, 'sent')}
    </View>
  );
}