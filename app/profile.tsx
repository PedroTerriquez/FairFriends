import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/services/authContext";

import baseStyles from "@/presentational/BaseStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "@/presentational/Spinner";
import { getProfile } from "@/services/api";
import { useTranslation } from "react-i18next";
import { colors, spacing } from "@/theme";

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
    <View style={[baseStyles.viewContainerFull, { backgroundColor: "white" }]}>
      {/* Card Name */}
      <TouchableOpacity style={[baseStyles.card, { backgroundColor: colors.primaryDark }]} key={info.id} >
        <View style={[baseStyles.cardContent, { paddingBottom: 0 }]}>
          <View style={baseStyles.rowCenter}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 75 }}
              source={{ uri: "https://picsum.photos/300/300.jpg" }}
            />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.personName}> {info.name} </Text>
              <Text style={{ fontSize: 14, marginTop: 10, color: colors.text.inverse }}> {t('profile.member_since') + info.created_at} </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Email */}
      <Text style={[{ marginVertical: 5, fontSize: 12, fontWeight: '600' }]}> ACCOUNT </Text>
      <TouchableOpacity style={[baseStyles.card]} key={info.id} onPress={logout}>
        <View style={[baseStyles.cardContent, { paddingBottom: 0 }]}>
          <View style={baseStyles.rowCenter}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.gray,
                justifyContent: "center",
                alignItems: "center",
                marginRight: spacing.xs,
              }}
            >
              <MaterialIcons name="email" size={20} color={colors.text.primary} />
            </View>
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.personName}> Email </Text>
              <Text style={{ fontSize: 14, marginTop: 10 }}> {info.email} </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Logout */}
      <TouchableOpacity testID="profile-logout" style={[baseStyles.card]} key={info.id} onPress={logout}>
        <View style={[baseStyles.cardContent, { paddingBottom: 0 }]}>
          {info.me == 1 && (<View style={baseStyles.rowCenter}>
            <TouchableOpacity style={[baseStyles.button, baseStyles.center, { flexDirection: 'row', padding: 0 }]} >
              <MaterialIcons name="logout" size={20} color="red" />
              <Text style={[baseStyles.buttonText, baseStyles.textCenter, baseStyles.redText]}>{t('profile.logout')}</Text>
            </TouchableOpacity>
          </View>)}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  personName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.inverse,
  },
});