import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";
import { colors, spacing, shadows } from "@/theme";
import formatMoney from "@/services/formatMoney";
import React, { useEffect, useRef } from "react";

/**
 * ModalSplitInfo - Comprehensive settlement details modal with spring animation
 * Shows ALL settlement information: optimal settlements, member breakdown, all payment types
 */

export default function ModalInfoSplit({ balanceSplittedInfo, visible, onClose }) {
    const { t } = useTranslation();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animate in
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 12,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset animations
            slideAnim.setValue(0);
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    if (!balanceSplittedInfo) return null;

    const {
        payments,
        paid_per_member,
        debt_per_member,
        balance_payments,
        uneven_payments,
        ordered_payments,
        total
    } = balanceSplittedInfo;

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                    activeOpacity={1}
                />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY }],
                        }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Settlement Details</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* SECTION 1: Optimal Settlements - THE MOST IMPORTANT */}
                        <View style={styles.highlightSection}>
                            <View style={styles.highlightHeader}>
                                <Ionicons name="flash" size={20} color={colors.primary} />
                                <Text style={styles.highlightTitle}>
                                    Optimal Settlement
                                </Text>
                            </View>
                            <Text style={styles.highlightDescription}>
                                Just {payments?.length || 0} {payments?.length === 1 ? 'transaction' : 'transactions'} needed to settle this balance fairly
                            </Text>

                            <View style={styles.paymentsContainer}>
                                {payments?.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                    <View key={index} style={styles.optimalPaymentCard}>
                                        <View style={styles.paymentRow}>
                                            <Avatar name={payment.from} size={40} />
                                            <View style={styles.paymentInfo}>
                                                <Text style={styles.paymentText}>
                                                    <Text style={styles.paymentName}>{payment.from}</Text>
                                                    <Text style={styles.paymentArrow}> → </Text>
                                                    <Text style={styles.paymentName}>{payment.to}</Text>
                                                </Text>
                                            </View>
                                            <Avatar name={payment.to} size={40} />
                                        </View>
                                        <Text style={styles.optimalAmount}>{formatMoney(payment.amount)}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* SECTION 2: Balance Breakdown */}
                        <Text style={styles.sectionTitle}>Balance Breakdown</Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Each person owes</Text>
                                <Text style={styles.infoValue}>{formatMoney(debt_per_member)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Total balance</Text>
                                <Text style={styles.infoValueBold}>{formatMoney(total)}</Text>
                            </View>
                        </View>

                        {/* SECTION 3: Member Details */}
                        <Text style={styles.sectionTitle}>Member Details</Text>
                        <View style={styles.tableCard}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Name</Text>
                                <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Paid</Text>
                                <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Balance</Text>
                            </View>

                            {paid_per_member?.map((member: [string, number], index: number) => {
                                const difference = member[1] - debt_per_member;
                                const isOver = difference > 0;
                                const isUnder = difference < 0;

                                return (
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCell, { flex: 2 }]}>
                                            <Avatar name={member[0]} size={32} />
                                            <Text style={styles.memberName}>{member[0]}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>
                                            {formatMoney(member[1])}
                                        </Text>
                                        <Text style={[
                                            styles.tableCell,
                                            {
                                                flex: 1.5,
                                                textAlign: 'right',
                                                fontWeight: '700',
                                                color: isOver ? colors.financial.positive : isUnder ? colors.financial.negative : colors.text.secondary
                                            }
                                        ]}>
                                            {isOver ? '+' : ''}{formatMoney(Math.abs(difference))}
                                        </Text>
                                    </View>
                                );
                            })}

                            <View style={[styles.tableRow, styles.tableFooter]}>
                                <Text style={[styles.tableCellBold, { flex: 2 }]}>Total</Text>
                                <Text style={[styles.tableCellBold, { flex: 1.5, textAlign: 'right' }]}>
                                    {formatMoney(total)}
                                </Text>
                                <Text style={[styles.tableCellBold, { flex: 1.5, textAlign: 'right' }]}>
                                    —
                                </Text>
                            </View>
                        </View>

                        {/* SECTION 4: Even Payments (Balance Payments) */}
                        {balance_payments && balance_payments.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Even Split Payments</Text>
                                <View style={styles.paymentsList}>
                                    {balance_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                        <View key={index} style={styles.simplePaymentRow}>
                                            <View style={styles.simplePaymentLeft}>
                                                <Avatar name={payment.from} size={32} />
                                                <Text style={styles.simplePaymentText}>
                                                    {payment.from} → {payment.to}
                                                </Text>
                                            </View>
                                            <Text style={styles.simplePaymentAmount}>{formatMoney(payment.amount)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* SECTION 5: Uneven Payments */}
                        {uneven_payments && uneven_payments.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Uneven Split Payments</Text>
                                <View style={styles.paymentsList}>
                                    {uneven_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                        <View key={index} style={styles.simplePaymentRow}>
                                            <View style={styles.simplePaymentLeft}>
                                                <Avatar name={payment.from} size={32} />
                                                <Text style={styles.simplePaymentText}>
                                                    {payment.from} → {payment.to}
                                                </Text>
                                            </View>
                                            <Text style={styles.simplePaymentAmount}>{formatMoney(payment.amount)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* SECTION 6: All Payments (Chronological Order) */}
                        {ordered_payments && ordered_payments.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>All Payments (Chronological)</Text>
                                <View style={styles.paymentsList}>
                                    {ordered_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                        <View key={index} style={styles.simplePaymentRow}>
                                            <View style={styles.simplePaymentLeft}>
                                                <Text style={styles.orderNumber}>{index + 1}</Text>
                                                <Avatar name={payment.from} size={32} />
                                                <Text style={styles.simplePaymentText}>
                                                    {payment.from} → {payment.to}
                                                </Text>
                                            </View>
                                            <Text style={styles.simplePaymentAmount}>{formatMoney(payment.amount)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        <View style={{ height: spacing.xl }} />
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
    },
    closeButton: {
        padding: spacing.sm,
    },
    content: {
        padding: spacing.lg,
    },

    // Optimal Settlements (Highlighted)
    highlightSection: {
        backgroundColor: colors.primaryLight,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    highlightTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
    highlightDescription: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    paymentsContainer: {
        gap: spacing.sm,
    },
    optimalPaymentCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentText: {
        fontSize: 15,
        textAlign: 'center',
    },
    paymentName: {
        fontWeight: '600',
        color: colors.text.primary,
    },
    paymentArrow: {
        color: colors.text.secondary,
    },
    optimalAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
        textAlign: 'center',
    },

    // Section Titles
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },

    // Info Cards
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBottom: spacing.xl,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    infoLabel: {
        fontSize: 15,
        color: colors.text.secondary,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    infoValueBold: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },

    // Table
    tableCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBottom: spacing.xl,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: colors.border.light,
        marginBottom: spacing.sm,
    },
    tableHeaderText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text.secondary,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceVariant,
    },
    tableCell: {
        fontSize: 15,
        color: colors.text.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    tableCellBold: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
    tableFooter: {
        borderBottomWidth: 0,
        borderTopWidth: 2,
        borderTopColor: colors.border.light,
        paddingTop: spacing.md,
        marginTop: spacing.sm,
    },
    memberName: {
        fontSize: 15,
        color: colors.text.primary,
    },

    // Simple Payments List
    paymentsList: {
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    simplePaymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    simplePaymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    simplePaymentText: {
        fontSize: 15,
        color: colors.text.primary,
        flex: 1,
    },
    simplePaymentAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
    orderNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.surfaceVariant,
        fontSize: 12,
        fontWeight: '700',
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});
