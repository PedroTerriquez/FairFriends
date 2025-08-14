import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "@/presentational/Spinner";

export default function Profile() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { session, signOut} = useSession();
  const { id } = useLocalSearchParams();

  const fetchProfile = async() => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API}/user/${id || ''}`, session)
      .then((response) => {
        setInfo(response.data)
      })
      .catch((error) => {
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const logout = () => {
    signOut()
    router.replace("/");
  };

  if (loading) return <Spinner />;

  if (!info) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={[baseStyles.alignItemsCenter, baseStyles.viewContainerFull, {backgroundColor: "white"}]}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 45 }}>{info.name}</Text>
      <Image
        style={{ width: 150, height: 150, borderRadius: 75 }}
        source={{ uri: "https://picsum.photos/300/300.jpg" }}
      />
      <Text style={{ fontSize: 14, marginVertical: 20 }}>
        Member since {info.created_at}
      </Text>
      {info.me == 1 && (<View style={baseStyles.rowCenter}>
        <TouchableOpacity style={[baseStyles.button, baseStyles.cancelButton, baseStyles.center, {flexDirection: 'row', gap: 10}]} onPress={logout} >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={[baseStyles.buttonText, baseStyles.textCenter]}>Log out</Text>
        </TouchableOpacity>
      </View>)}
      {info.me != 1 && (
        <><View style={[baseStyles.rowCenter, { marginTop: 20 }]}>
          <Text style={baseStyles.title15}>Start a promise or a balance with {info.name}</Text>
        </View><View style={[baseStyles.rowCenter, { marginTop: 20 }]}>
            <TouchableOpacity
              style={[baseStyles.circleButton, baseStyles.greenBG]}
              onPress={() => router.push({
                pathname: '/formPromise',
                params: { administrator_id: id, administrator_name: info.name }
              })}
            >
              <MaterialIcons name="attach-money" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseStyles.circleButton, baseStyles.blueBG, baseStyles.marginLeft]}
              onPress={() => {
                axios.post(`${process.env.EXPO_PUBLIC_API}/balances/`, { members: [id] }, session)
                  .then((response) => {
                    router.push({
                      pathname: '/balance',
                      params: { paymentable_id: response.data.id }
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } }
            >
              <FontAwesome name="balance-scale" size={20} color="white" />
            </TouchableOpacity>
          </View></>
      )}
    </View>
  );
};