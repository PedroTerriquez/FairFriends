import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { useSession } from "@/services/authContext";
import Person from '@/presentational/Person';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router } from "expo-router";
import Spinner from "@/presentational/Spinner";

export default function contactRequests() {
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { session } = useSession();

  const fetchRequests = async () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API}/friendships/requests`, session)
      .then((response) => {
        setPending(response.data.pending)
        setSent(response.data.sent)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
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
  
  const showEmptyState = () => {
    return (<EmptyList text={"No friendships pending"}>
      <Text style={baseStyles.label17}>Start adding some {''}
        <Pressable onPress={() => { router.push("/addContact") }}>
          <Text style={baseStyles.link}>friends</Text>
        </Pressable>
      </Text>
    </EmptyList>)
  }
  
  const renderRequests = (contacts, type) => {
    if (contacts.length == 0) return showEmptyState();

    if (type == 'pending') {
      return renderPendingContacts(contacts)
    } else if (type == 'sent') {
      return renderSentRequests(contacts)
    }
  }

  const renderSentRequests = (contacts) => {
    return contacts.map(contact => (
      <Person key={contact.friendship_id} person={contact} >
        {contact.friendship_id && (
          <TouchableOpacity style={[baseStyles.circleButton, baseStyles.redBG]} onPress={() => cancelRequest(contact.friendship_id)}>
            <MaterialCommunityIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        )}
      </Person>
    ))
  }

  const renderPendingContacts = (contacts) => {
    return contacts.map(contact => (
      <Person key={contact.friendship_id} person={contact} >
        {contact.friendship_id && (
          <View style={baseStyles.rowCenter}>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.redBG]} onPress={() => rejectRequest(contact.friendship_id)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.circleButton, baseStyles.greenBG, baseStyles.marginLeft]} onPress={() => acceptRequest(contact.friendship_id)}>
                <MaterialIcons name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          </Person>
      ))
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={baseStyles.viewContainerFull}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={baseStyles.viewRowWithSpace}>
        <Pressable onPress={() => setActiveTab("Pending")} style={activeTab === "Pending" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}>
          <Text style={activeTab === "Pending" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>Pending</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Sent")} style={activeTab === "Sent" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}>
          <Text style={activeTab === "Sent" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>Sent</Text>
        </Pressable>
      </View>
      {activeTab === "Pending" ? renderRequests(pending, 'pending') : renderRequests(sent, 'sent')}
    </ScrollView>
  );
}