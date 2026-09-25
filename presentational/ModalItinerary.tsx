import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { colors, spacing, shadows } from "@/theme";
import formatMoney from "@/services/formatMoney";
import { CATEGORY_CONFIG } from "@/services/categoryConfig";
import React, { useEffect, useRef } from "react";

interface Payment {
    id: string | number;
    location?: string;
    amount: number;
    creator_name: string;
    category: number;
    title?: string;
    created_at: string;
    agreement_date: string;
}

interface ModalItineraryProps {
    payments: Payment[];
    visible: boolean;
    onClose: () => void;
}

const LINE_COLOR = "rgba(168, 85, 247, 0.25)";
const BADGE_BORDER_COLOR = "rgba(168, 85, 247, 0.35)";

export default function ModalItinerary({ payments, visible, onClose }: ModalItineraryProps) {
    const { t, i18n } = useTranslation();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
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

    if (!payments || payments.length === 0) return null;

    const parseAmount = (a: any) =>
        typeof a === "string" ? parseFloat(a.replace(/[^0-9.-]/g, "")) || 0 : a || 0;

    const totalAmount = payments.reduce((sum, item) => sum + parseAmount(item.amount), 0);

    const isoKey = (d: string) => {
        const dt = new Date(d);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    };

    const paymentsByDate = payments.reduce((acc, p) => {
        const key = isoKey(p.agreement_date);
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {} as Record<string, Payment[]>);

    const sortedDates = Object.keys(paymentsByDate).sort((a, b) => b.localeCompare(a));

    const formatDateLong = (iso: string) =>
        new Date(iso + "T00:00:00").toLocaleDateString(i18n.language, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    const getCategoryEmoji = (category: number) => {
        return CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.emoji || CATEGORY_CONFIG[0].emoji;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim } as any]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                    activeOpacity={1}
                />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ] as any}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {t("itinerary.events_count", { count: payments.length })}
                        </Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Compact total row (multi-day only) */}
                    {sortedDates.length > 1 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>{t("itinerary.total")}</Text>
                            <Text style={styles.totalAmount}>{formatMoney(totalAmount)}</Text>
                        </View>
                    )}

                    {/* Timeline */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {sortedDates.map((date) => {
                            const dateTotal = paymentsByDate[date].reduce((sum, p) => sum + parseAmount(p.amount), 0);
                            const items = paymentsByDate[date];
                            return (
                                <View key={date} style={styles.dateGroup}>
                                    {/* Date header row */}
                                    <View style={styles.dateSection}>
                                        <View style={styles.dateHeaderContainer}>
                                            <Ionicons name="location" size={20} color={colors.accent} />
                                            <Text style={styles.dateHeader}>{formatDateLong(date)}</Text>
                                        </View>
                                        <Text style={styles.dateTotal}>{formatMoney(dateTotal)}</Text>
                                    </View>

                                    {/* Payment items */}
                                    {items.map((payment, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === items.length - 1;
                                        return (
                                            <View key={payment.id} style={styles.timelineItem}>
                                                <View style={styles.badgeColumn}>
                                                    {!isFirst && <View style={styles.lineSegment} />}
                                                    <View style={styles.badgeContainer}>
                                                        <Text style={styles.emoji}>
                                                            {getCategoryEmoji(payment.category)}
                                                        </Text>
                                                    </View>
                                                    {!isLast && <View style={styles.lineSegment} />}
                                                </View>

                                                <View style={styles.paymentCard}>
                                                    <View style={styles.paymentHeader}>
                                                        <View style={styles.paymentTitleSection}>
                                                            <Text
                                                                style={styles.paymentName}
                                                                numberOfLines={1}
                                                            >
                                                                {payment.title || "Payment"}
                                                            </Text>
                                                            <Text
                                                                style={styles.paymentDescription}
                                                                numberOfLines={1}
                                                            >
                                                                {payment.location || payment.creator_name}
                                                            </Text>
                                                        </View>
                                                        <Text style={styles.paymentAmount}>
                                                            {formatMoney(parseAmount(payment.amount))}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: colors.primaryLight,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: spacing.lg,
        maxHeight: "85%",
        ...shadows.lg,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text.primary,
    },
    closeButton: {
        padding: spacing.xs,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.secondary,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.accent,
    },
    scrollView: {
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
    },
    dateGroup: {
        marginBottom: spacing.md,
    },
    dateSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
        marginBottom: spacing.sm,
    },
    dateHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text.primary,
    },
    dateTotal: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text.primary,
    },
    timelineItem: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    badgeColumn: {
        alignItems: "center",
        marginRight: spacing.md,
        width: 48,
    },
    lineSegment: {
        width: 2,
        flex: 1,
        minHeight: 8,
        backgroundColor: LINE_COLOR,
    },
    badgeContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: BADGE_BORDER_COLOR,
        justifyContent: "center",
        alignItems: "center",
    },
    emoji: {
        fontSize: 24,
    },
    paymentCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.md,
        marginVertical: spacing.xs,
        ...shadows.sm,
    },
    paymentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paymentTitleSection: {
        flex: 1,
        marginRight: spacing.md,
    },
    paymentName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    paymentDescription: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.accent,
    },
});
