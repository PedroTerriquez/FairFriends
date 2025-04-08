import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

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

  const cancelRequest = (friendship_id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${friendship_id}/cancel`, {}, session)
      .then((response) => {
        removeCard(friendship_id, 'sent')
      })
      .catch((error) => {
      })
  }

  const rejectRequest = (friendship_id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${friendship_id}/reject`, {}, session)
      .then((response) => {
        removeCard(friendship_id, 'pending')
      })
      .catch((error) => {
      })
  }

  const acceptRequest = (friendship_id) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/${friendship_id}/accept`, {}, session)
      .then((response) => {
        removeCard(friendship_id, 'pending')
      })
      .catch((error) => {
      })
  }

  const removeCard = (friendship_id, type) => {
    if (type == 'sent') {
      const newPeople = sent.filter((friendship) => friendship.friendship_id !== friendship_id)
      setSent(newPeople)
    } else if (type == 'pending') {
      const newPeople = pending.filter((friendship) => friendship.friendship_id !== friendship_id)
      setPending(newPeople)
    }
  }
  
  const renderRequests = (contacts, type) => {
    if (contacts.length == 0) return <View style={[baseStyles.viewContainer, baseStyles.center]}><Text>No friendships pending</Text></View>

    if (type == 'pending') {
      return renderPendingContacts(contacts)
    } else if (type == 'sent') {
      return renderSentContacts(contacts)
    }
  }

  const renderSentContacts = (contacts) => {
    return contacts.map(contact => (
      <Person person={contact} >
        {contact.friendship_id && (
          <TouchableOpacity style={[baseStyles.circleButton, baseStyles.red]} onPress={() => cancelRequest(contact.friendship_id)}>
            <MaterialCommunityIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        )}
      </Person>
    ))
  }

  const renderPendingContacts = (contacts) => {
    return contacts.map(contact => (
      <Person person={contact} >
        {contact.friendship_id && (
          <View style={baseStyles.rowCenter}>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.red]} onPress={() => rejectRequest(contact.friendship_id)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.green, baseStyles.marginLeft]} onPress={() => acceptRequest(contact.friendship_id)}>
                <MaterialIcons name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          </Person>
      ))
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <View style={{ flex: 1 }}>


      {activeTab === "Pending" ? renderRequests(pending, 'pending') : renderRequests(sent, 'sent')}
    </View>
  );
}