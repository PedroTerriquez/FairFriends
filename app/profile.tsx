import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";

export default function Profile() {
  const [info, setInfo] = useState<any>(null);
  const { session, signOut} = useSession();
  const { id } = useLocalSearchParams();

  const fetchProfile = async() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/user/${id || ''}`, session)
      .then((response) => {
        console.log(response)
        setInfo(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const logout = () => {
    signOut()
    router.replace("/");
  };

  if (!info) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={[baseStyles.card, baseStyles.rightColumn]}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15 }}>{info.name}</Text>
      <Image
        style={{ width: 150, height: 150, borderRadius: 75 }}
        source={{ uri: "https://picsum.photos/300/300.jpg" }}
      />
      <Text style={{ fontSize: 14, marginVertical: 20 }}>
        Member since {info.created_at}
      </Text>
      {info.me == 1 && (<Pressable style={[baseStyles.button, baseStyles.cancelButton]} onPress={logout} >

        <Text style={baseStyles.buttonText}>Log out</Text>
      </Pressable>)}
    </View>
  );
};