import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import baseStyles from './BaseStyles';
import Avatar from "./Avatar";
import AcceptButton, { RejectButton } from "./Buttons";
import formatDate from "@/services/formatDate";
import { colors, spacing, typography } from '@/theme';

const TYPE_META = {
  Balance:    { icon: 'wallet',    color: colors.primary,            bg: colors.primaryLight,          labelKey: 'notifications.type.balance' },
  Promise:    { icon: 'hand-left', color: colors.financial.warning,  bg: colors.financial.warningLight, labelKey: 'notifications.type.promise' },
  Payment:    { icon: 'cash',      color: colors.financial.positive, bg: colors.financial.positiveLight, labelKey: 'notifications.type.payment' },
  Friendship: { icon: 'people',    color: colors.info,               bg: colors.infoLight,             labelKey: 'notifications.type.friendship' },
};

export default function NotificationCard({
  id,
  notifiableId,
  notifiableType,
  paymentableId,
  paymentableType,
  date,
  amount,
  status,
  creatorName,
  updateStatus,
  message,
}) {
  const { t } = useTranslation();
  const isPending = status === 'pending';
  const typeMeta = TYPE_META[notifiableType] || TYPE_META.Balance;

  const handleShow = () => {
    let route;
    let targetId = notifiableId;
    switch (notifiableType) {
      case 'Promise':
        route = 'promise';
        break;
      case 'Balance':
        route = 'balance';
        break;
      case 'Payment':
        route = paymentableType?.toLowerCase();
        targetId = paymentableId;
        break;
      case 'Friendship':
        route = 'profile';
        break;
      default:
        route = 'default';
        break;
    }
    router.push({ pathname: route, params: { id: targetId } });
  };

  return (
    <Pressable
      onPress={handleShow}
      style={[baseStyles.card, isPending && styles.cardPending]}>
      <View style={styles.header}>
        <Avatar name={creatorName} size={44} />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleText}>
              <Text style={styles.title} numberOfLines={2}>
                {creatorName}
                <Text style={styles.titleMessage}> {message}</Text>
              </Text>
            </View>
            {amount ? <Text style={styles.amount}>{amount}</Text> : null}
          </View>
          <View style={styles.metaRow}>
            {isPending ? (
              <View style={[styles.pill, { backgroundColor: typeMeta.bg }]}>
                <Ionicons name={typeMeta.icon} size={12} color={typeMeta.color} />
                <Text style={[styles.pillText, { color: typeMeta.color }]}>
                  {t(typeMeta.labelKey)}
                </Text>
              </View>
            ) : (
              <View style={[styles.pill, { backgroundColor: status === 'accepted' ? colors.financial.positiveLight : colors.financial.negativeLight }]}>
                <Ionicons
                  name={status === 'accepted' ? 'checkmark' : 'close'}
                  size={12}
                  color={status === 'accepted' ? colors.financial.positive : colors.financial.negative}
                />
                <Text style={[styles.pillText, { color: status === 'accepted' ? colors.financial.positive : colors.financial.negative }]}>
                  {t(status === 'accepted' ? 'notifications.accepted' : 'notifications.rejected')}
                </Text>
              </View>
            )}
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaDate}>{formatDate(date)}</Text>
          </View>
        </View>
      </View>

      {isPending && (
        <>
          <View style={styles.divider} />
          <View style={styles.actions}>
            <RejectButton
              testID={`notification-reject-${id}`}
              onPressAction={() => updateStatus(id, 'rejected')}
            />
            <AcceptButton
              testID={`notification-accept-${id}`}
              onPressAction={() => updateStatus(id, 'accepted')}
            />
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardPending: {
    borderWidth: 2,
    borderColor: colors.financial.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  titleMessage: {
    fontWeight: '400',
  },
  amount: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaDot: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  metaDate: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
