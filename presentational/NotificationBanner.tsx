import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import SkeletonWrapper from "./SkeletonWrapper";
import { spacing } from "../theme";

export default function NotificationBanner({ quantity, onPress, loading = false }) {
  const { t } = useTranslation();
  const count = quantity || 0;
  const hasPending = count > 0;

  return (
    <SkeletonWrapper show={loading}>
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={["#6366f1", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="notifications-outline" size={28} color="white" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.smallLabel}>{t("home.notifications.label")}</Text>
              <Text style={styles.title}>
                {hasPending
                  ? t("home.notifications.pending", { count })
                  : t("home.notifications.caughtUp")}
              </Text>
              <Text style={styles.subtitle}>
                {hasPending
                  ? t("home.notifications.subtitle")
                  : t("home.notifications.noPending")}
              </Text>
            </View>

            {hasPending && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </SkeletonWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  smallLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    width: 32,
    height: 32,
    backgroundColor: "#fbbf24",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#78350f",
    fontWeight: "bold",
    fontSize: 14,
  },
});
