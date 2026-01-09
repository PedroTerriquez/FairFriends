import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import Person from '@/presentational/Person';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router } from "expo-router";
import Spinner from "@/presentational/Spinner";
import {
  getContactRequests,
  cancelFriendshipRequest,
  rejectFriendshipRequest,
  acceptFriendshipRequest
} from "@/services/api";
import AcceptButton, { RejectButton } from "@/presentational/acceptButton";
import TopNavBar from "@/presentational/TopNavBar";

export default function contactRequests() {
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    getContactRequests()
      .then((response) => {
        setPending(response.data.pending)
        setSent(response.data.sent)
      })
      .catch((error) => {
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const cancelRequest = (friendship_id) => {
    cancelFriendshipRequest(friendship_id)
      .then((response) => {
        removeCard(friendship_id, 'sent')
      })
      .catch((error) => {
      })
  }

  const rejectRequest = (friendship_id) => {
    rejectFriendshipRequest(friendship_id)
      .then((response) => {
        removeCard(friendship_id, 'pending')
      })
      .catch((error) => {
      })
  }

  const acceptRequest = (friendship_id) => {
    acceptFriendshipRequest(friendship_id)
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
    if (type == 'pending') {
      return renderPendingContacts(contacts)
    } else if (type == 'sent') {
      return renderSentRequests(contacts)
    }
  }

  const emptySentRequests = <EmptyList text={"No friendship requests sent"}>
    <Text style={baseStyles.label17}>Start adding some {''}
      <Pressable onPress={() => { router.push("/addContact") }}>
        <Text style={baseStyles.link}>friends</Text>
      </Pressable>
    </Text>
  </EmptyList>;

  const renderSentRequests = (contacts) => {
    if (contacts.length == 0) return emptySentRequests;

    return contacts.map(contact => (
      <Person key={contact.friendship_id} person={contact} >
        {contact.friendship_id && (
          <RejectButton onPressAction={() => cancelRequest(contact.friendship_id)}></RejectButton>
        )}
      </Person>
    ))
  }
  
  const emptyPendingFriendships =
    <EmptyList text={"No friendships pending"}>
      <Text style={baseStyles.label17}>Start adding some {''}
        <Pressable onPress={() => { router.push("/addContact") }}>
          <Text style={baseStyles.link}>friends</Text>
        </Pressable>
      </Text>
    </EmptyList>;

  const renderPendingContacts = (contacts) => {
    if (contacts.length == 0) return emptyPendingFriendships;

    return contacts.map(contact => (
      <Person key={contact.friendship_id} person={contact} >
        {contact.friendship_id && (
          <View style={[baseStyles.rowCenter, { gap: 5 }]}>
              <RejectButton onPressAction={rejectRequest.bind(this, contact.friendship_id)}></RejectButton>
              <AcceptButton onPressAction={acceptRequest.bind(this, contact.friendship_id)}></AcceptButton>
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
    <View style={baseStyles.viewContainerFull} >
      <View>
        <TopNavBar menus={["pending", "sent"]} activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "pending" ? renderRequests(pending, 'pending') : renderRequests(sent, 'sent')}
      </ScrollView>
    </View>
  );
}