import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

import { colors, spacing, typography } from "@/theme";
import Avatar from "./Avatar";
import { CATEGORY_CONFIG } from "@/services/categoryConfig";
import formatMoney from "@/services/formatMoney";

const getRelativeTime = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffDays === 0 && diffHours < 1) return "Just now";
  if (diffDays === 0) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function UnevenPaymentCard({
  title,
  amount,
  creatorName,
  mine,
  date,
  category,
  promises,
}) {
  const { t } = useTranslation();
  const categoryConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG[0];

  const totalNumeric = parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 0;
  const promisesList = promises || [];
  const promisesTotal = promisesList.reduce((sum, p) => sum + p.total, 0);
  const creatorAmount = totalNumeric - promisesTotal;

  const members = promisesList.map((p) => ({
    id: p.id,
    name: p.name,
    total: p.total,
    paid: p.paid || 0,
    isYou: mine && p.name === creatorName,
  }));

  if (creatorAmount > 0 && !promisesList.some((p) => p.name === creatorName)) {
    members.unshift({
      id: undefined,
      name: creatorName,
      total: creatorAmount,
      paid: creatorAmount,
      isYou: mine,
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {t("unevenPaymentCard.title")}
        </Text>
        <Text style={styles.headerAmount}>{amount}</Text>
      </View>

      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle} numberOfLines={1}>
          {title} - {t("unevenPaymentCard.unevenSplit")}
        </Text>
        <Text style={styles.timeText}>{getRelativeTime(date)}</Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.badgeEmoji}>{categoryConfig.emoji}</Text>
          <Text style={styles.badgeText}>{categoryConfig.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        {t("unevenPaymentCard.splitBreakdown")}
      </Text>

      {members.map((member, index) => {
        const percentage =
          member.total > 0
            ? Math.round((member.paid / member.total) * 100)
            : 0;
        const canNavigate = member.id != null;
        const handlePress = () => {
          if (canNavigate) {
            router.push({ pathname: "/promiseShow", params: { id: member.id } });
          }
        };

        return (
          <TouchableOpacity
            key={member.id ?? `creator-${index}`}
            style={styles.memberRow}
            onPress={handlePress}
            disabled={!canNavigate}
            activeOpacity={canNavigate ? 0.7 : 1}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Avatar name={member.name} size={40} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName} numberOfLines={1}>
                {member.isYou ? t("balanceCard.you") : member.name}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${percentage}%` }]}
                />
              </View>
            </View>
            <View style={styles.memberAmountCol}>
              <Text style={styles.memberAmount}>
                {formatMoney(member.total)}
              </Text>
              <Text style={styles.memberPercent}>{percentage}%</Text>
            </View>
            {canNavigate && (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.text.tertiary}
              />
            )}
          </TouchableOpacity>
        );
      })}

      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>
          {t("unevenPaymentCard.totalSplit")}
        </Text>
        <Text style={styles.footerValue}>
          {t("unevenPaymentCard.people", { count: members.length })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    ...typography.h4,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  headerAmount: {
    ...typography.h3,
    fontWeight: "700",
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  timeText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  memberInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  memberName: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.text.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  memberAmountCol: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  memberAmount: {
    ...typography.bodySmall,
    fontWeight: "700",
    color: colors.text.primary,
  },
  memberPercent: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  footerValue: {
    ...typography.bodySmall,
    fontWeight: "700",
    color: colors.text.primary,
  },
});

export default React.memo(UnevenPaymentCard);
