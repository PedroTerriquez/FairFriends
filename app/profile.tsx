import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/services/authContext";

import baseStyles from "@/presentational/BaseStyles";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "@/presentational/Spinner";
import { createBalance, getProfile } from "@/services/api";
import ButtonWithIcon from "@/presentational/ButtonWithIcon";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const { signOut } = useSession();

  const fetchProfile = async () => {
    setLoading(true);
    getProfile(id)
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
    <View style={[baseStyles.alignItemsCenter, baseStyles.viewContainerFull, { backgroundColor: "white" }]}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 45 }}>{info.name}</Text>
      <Image
        style={{ width: 150, height: 150, borderRadius: 75 }}
        source={{ uri: "https://picsum.photos/300/300.jpg" }}
      />
      <Text style={{ fontSize: 14, marginVertical: 20 }}>
        {t('profile.member_since') + info.created_at}
      </Text>
      {info.me == 1 && (<View style={baseStyles.rowCenter}>
        <TouchableOpacity style={[baseStyles.button, baseStyles.cancelButton, baseStyles.center, { flexDirection: 'row', gap: 10 }]} onPress={logout} >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={[baseStyles.buttonText, baseStyles.textCenter]}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>)}
      {info.me != 1 && (
        <View style={[baseStyles.rowCenter, { marginTop: 10, gap: 20 }]}>
          <ButtonWithIcon
            style={ baseStyles.successBG }
            onPress={() => router.push({ pathname: '/formPromise', params: { administrator_id: id, administrator_name: info.name } })}
            icon={<MaterialIcons name="attach-money" size={20} color="white" />}
            text="Promise" />
          <ButtonWithIcon
            style={ baseStyles.blueBG }
            onPress={() => {
              createBalance([id], undefined)
                .then((response) => {
                  router.push({
                    pathname: '/balance',
                    params: { paymentable_id: response.data.id }
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
            icon={<FontAwesome name="balance-scale" size={20} color="white" />}
            text="Split" />
        </View>
      )}
    </View>
  );
};