import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useSession } from "@/services/authContext";
import { getProfile } from "@/services/api";
import Avatar from "@/presentational/Avatar";
import Spinner from "@/presentational/Spinner";
import baseStyles from "@/presentational/BaseStyles";
import { colors, spacing, typography, shadows } from "@/theme";

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
        setInfo(response.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const logout = () => {
    signOut();
    router.replace("/");
  };

  if (loading) return <Spinner />;
  if (!info) return <Spinner />;

  const sections = [
    {
      title: t("profile.account"),
      items: [
        { icon: "mail-outline", label: t("profile.email"), value: info.email },
        { icon: "call-outline", label: t("profile.phone") },
        { icon: "card-outline", label: t("profile.payment_methods") },
      ],
    },
    {
      title: t("profile.preferences"),
      items: [
        {
          icon: "notifications-outline",
          label: t("profile.notifications"),
          onPress: () => router.push("/notifications"),
        },
        { icon: "settings-outline", label: t("profile.settings") },
        { icon: "shield-checkmark-outline", label: t("profile.privacy") },
      ],
    },
    {
      title: t("profile.support"),
      items: [
        { icon: "help-circle-outline", label: t("profile.help") },
      ],
    },
  ];

  return (
    <ScrollView
      style={baseStyles.viewContainerFull}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient header */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={baseStyles.rowCenter}>
          <Avatar name={info.name} size={72} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={styles.headerName}>{info.name}</Text>
            <Text style={styles.headerSubtitle}>
              {t("profile.member_since") + info.created_at}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Menu sections */}
      {sections.map((section, sIdx) => (
        <View key={sIdx} style={{ marginBottom: spacing.lg }}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, iIdx) => {
              const isLast = iIdx === section.items.length - 1;
              const hasAction = typeof item.onPress === "function";
              return (
                <TouchableOpacity
                  key={iIdx}
                  onPress={item.onPress}
                  disabled={!hasAction}
                  activeOpacity={hasAction ? 0.6 : 1}
                  style={[styles.row, !isLast && styles.rowDivider]}
                >
                  <View style={styles.iconBubble}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.rowValue}>{item.value}</Text>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Sign Out */}
      {info.me == 1 && (
        <TouchableOpacity
          testID="profile-logout"
          style={[styles.sectionCard, styles.signOutButton]}
          onPress={logout}
          activeOpacity={0.6}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.signOutText}>{t("profile.sign_out")}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.version}>{t("profile.version")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 24,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  headerName: {
    ...typography.h2,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.text.inverse,
    opacity: 0.85,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: "hidden",
    ...shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text.primary,
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  signOutText: {
    ...typography.button,
    color: colors.error,
    fontWeight: "700",
  },
  version: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
