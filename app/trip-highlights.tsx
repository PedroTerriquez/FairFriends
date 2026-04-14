import { useCallback, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Share,
  Platform,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getBalanceInfo, getBalanceDetail } from "@/services/api";
import { useTranslation } from "react-i18next";

import Avatar from "@/presentational/Avatar";
import Spinner from "@/presentational/Spinner";
import { colors, spacing, typography } from "@/theme";
import formatMoney from "@/services/formatMoney";

const { width } = Dimensions.get("window");

interface HighlightSlide {
  id: string;
  gradient: [string, string, string];
  icon: string;
  title: string;
}

interface BalanceMember {
  user_id: string;
  name: string;
  money: number;
}

interface BalanceData {
  id: string;
  name: string;
  total: number;
  budget?: number;
  start_date?: string;
  end_date?: string;
  balance_members: BalanceMember[];
  creator_id?: string;
  status?: string;
}

interface Payment {
  id: string;
  amount: number;
  category?: string;
  created_at?: string;
  title?: string;
}

export default function TripHighlights() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [balanceDetail, setBalanceDetail] = useState<BalanceData | null>(null);
  const [balanceInfo, setBalanceInfo] = useState<{ payments?: Payment[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [detailRes, infoRes] = await Promise.all([
        getBalanceDetail(id as string),
        getBalanceInfo(id as string),
      ]);

      if (detailRes?.data?.balance) {
        setBalanceDetail(detailRes.data.balance);
      }
      if (infoRes?.data) {
        setBalanceInfo(infoRes.data);
      }
    } catch (error) {
      console.error("Error fetching balance data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Use useEffect for side effects (data fetching)
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  // Prepare data with defaults (moved before conditional - no early returns)
  const balance = balanceDetail;
  const payments: Payment[] = balanceInfo?.payments || [];

  // Calculate member count
  const memberCount = useMemo(() => {
    return balance?.balance_members?.length || 0;
  }, [balance?.balance_members]);

  // Calculate member contributions
  const memberContributions = useMemo(() => {
    if (!balance?.balance_members) return [];
    return balance.balance_members.map((member: BalanceMember) => ({
      member,
      contribution: member.money || 0,
    }));
  }, [balance?.balance_members]);

  const topContributor = useMemo(() => {
    if (memberContributions.length === 0) return null;
    return memberContributions.reduce((max, current) =>
      current.contribution > max.contribution ? current : max
    );
  }, [memberContributions]);

  // Category analysis from payments
  const categorySpending = useMemo(() => {
    return payments.reduce((acc: Record<string, number>, payment: Payment) => {
      const category = payment.category || "other";
      acc[category] = (acc[category] || 0) + payment.amount;
      return acc;
    }, {});
  }, [payments]);

  const topCategory = useMemo(() => {
    return Object.entries(categorySpending).reduce<{ category: string; amount: number } | null>(
      (max, [category, amount]) =>
        amount > (max?.amount || 0) ? { category, amount } : max,
      null
    );
  }, [categorySpending]);

  // Budget stats
  const budget = balance?.budget || 0;
  const budgetUsed = balance?.total || 0;
  const budgetRemaining = budget - budgetUsed;
  const budgetProgress = budget > 0 ? (budgetUsed / budget) * 100 : 0;

  // Build highlights array
  const highlights: HighlightSlide[] = useMemo(() => {
    const slides: HighlightSlide[] = [
      {
        id: "top-contributor",
        gradient: ["#A855F7", "#9333EA", "#7E22CE"],
        icon: "trophy",
        title: "Top Contributor",
      },
    ];

    if (topCategory) {
      slides.push({
        id: "top-category",
        gradient: ["#F97316", "#EA580C", "#C2410C"],
        icon: "trending-up",
        title: "Most Spending",
      });
    }

    if (budget > 0) {
      slides.push({
        id: "budget-summary",
        gradient: ["#10B981", "#059669", "#047857"],
        icon: "sparkles",
        title: "Budget Summary",
      });
    }

    slides.push({
      id: "trip-summary",
      gradient: ["#6366F1", "#4F46E5", "#4338CA"],
      icon: "location",
      title: "Trip Summary",
    });

    return slides;
  }, [topCategory, budget]);

  const handleShare = useCallback(async () => {
    try {
      if (!balance) return;
      const summary = `${balance.name} - $${formatMoney(balance.total)} total expenses`;
      if (Platform.OS === "web") {
        // Web fallback
        alert("Share functionality would trigger native share");
      } else {
        await Share.share({
          message: summary,
          title: `${balance.name} Trip Highlights`,
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  }, [balance]);

  // NOW we can do the conditional return (AFTER all hooks)
  if (loading || !balance) {
    return <Spinner />;
  }

  const renderSlide = (slideId: string) => {
    switch (slideId) {
      case "top-contributor":
        return (
          <View style={styles.slideContent}>
            {/* Icon Circle */}
            <View style={styles.iconCircle}>
              <Ionicons name="trophy" size={56} color="#FFFFFF" />
            </View>

            {/* Title */}
            <Text style={[typography.h1, styles.slideTitle]}>
              {t("trip_highlights.top_contributor")}
            </Text>

            {/* Info Card */}
            <View style={styles.infoCard}>
              {topContributor && (
                <>
                  <Avatar name={topContributor.member.name} size={80} />
                  <Text style={styles.memberName}>
                    {topContributor.member.name === balance?.name
                      ? t("trip_highlights.you_paid_most")
                      : t("trip_highlights.paid_most", {
                          name: topContributor.member.name,
                        })}
                  </Text>
                  <Text style={styles.amount}>
                    ${topContributor.contribution.toFixed(0)}
                  </Text>
                  <Text style={styles.label}>
                    {t("trip_highlights.contributed")}
                  </Text>
                </>
              )}
            </View>
          </View>
        );

      case "top-category":
        if (!topCategory) return null;
        return (
          <View style={styles.slideContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="trending-up" size={56} color="#FFFFFF" />
            </View>

            <Text style={[typography.h1, styles.slideTitle]}>
              {t("trip_highlights.most_spending")}
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.categoryLabel}>{topCategory.category}</Text>
              <Text style={styles.amount}>
                ${topCategory.amount.toFixed(0)}
              </Text>
              <Text style={styles.label}>
                {(
                  (topCategory.amount / balance.total) *
                  100
                ).toFixed(0)}% {t("trip_highlights.of_total")}
              </Text>
            </View>
          </View>
        );

      case "budget-summary":
        return (
          <View style={styles.slideContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={56} color="#FFFFFF" />
            </View>

            <Text style={[typography.h1, styles.slideTitle]}>
              {budgetRemaining >= 0
                ? t("trip_highlights.under_budget")
                : t("trip_highlights.over_budget")}
            </Text>

            <View style={styles.infoCard}>
              <View style={styles.budgetStats}>
                <Text style={styles.budgetLabel}>
                  {t("trip_highlights.total_spent")}
                </Text>
                <Text style={styles.budgetAmount}>
                  ${budgetUsed.toFixed(0)}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(budgetProgress, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.budgetGrid}>
                <View style={styles.budgetGridItem}>
                  <Text style={styles.gridLabel}>
                    {t("trip_highlights.budget")}
                  </Text>
                  <Text style={styles.gridAmount}>${budget.toFixed(0)}</Text>
                </View>
                <View style={styles.budgetGridItem}>
                  <Text style={styles.gridLabel}>
                    {budgetRemaining >= 0
                      ? t("trip_highlights.remaining")
                      : t("trip_highlights.over_by")}
                  </Text>
                  <Text style={styles.gridAmount}>
                    ${Math.abs(budgetRemaining).toFixed(0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      case "trip-summary":
        return (
          <View style={styles.slideContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={56} color="#FFFFFF" />
            </View>

            <Text style={[typography.h1, styles.slideTitle]}>
              {balance.name}
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.amount}>
                ${balance.total.toFixed(0)}
              </Text>
              <Text style={styles.label}>
                {t("trip_highlights.total_expenses")}
              </Text>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryGridItem}>
                  <Text style={styles.gridLabel}>
                    {t("trip_highlights.people")}
                  </Text>
                  <Text style={styles.gridAmount}>{memberCount}</Text>
                </View>
                <View style={styles.summaryGridItem}>
                  <Text style={styles.gridLabel}>
                    {t("trip_highlights.payments")}
                  </Text>
                  <Text style={styles.gridAmount}>{payments.length}</Text>
                </View>
              </View>

              {balance.start_date && balance.end_date && (
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar" size={16} color="#FFFFFF" />
                  <Text style={styles.dateText}>
                    {new Date(balance.start_date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}{" "}
                    -{" "}
                    {new Date(balance.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const currentHighlight = highlights[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentHighlight.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerButton}
          >
            <Ionicons name="share-social" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Slide Content */}
        {renderSlide(currentHighlight.id)}

        {/* Bottom Section */}
        <View style={styles.bottom}>
          {/* Slide Indicators */}
          <View style={styles.indicators}>
            {highlights.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[
                  styles.indicator,
                  {
                    width: index === currentSlide ? 24 : 8,
                    backgroundColor:
                      index === currentSlide ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                  },
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              onPress={() =>
                setCurrentSlide((prev) => Math.max(0, prev - 1))
              }
              disabled={currentSlide === 0}
              style={[
                styles.navButton,
                styles.prevButton,
                currentSlide === 0 && styles.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentSlide === 0 && styles.buttonDisabledText,
                ]}
              >
                {t("common.previous")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setCurrentSlide((prev) =>
                  Math.min(highlights.length - 1, prev + 1)
                )
              }
              disabled={currentSlide === highlights.length - 1}
              style={[
                styles.navButton,
                styles.nextButton,
                currentSlide === highlights.length - 1 &&
                  styles.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.nextButtonText,
                ]}
              >
                {t("common.next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  gradientContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  } as ViewStyle,
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
  } as ViewStyle,
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  } as ViewStyle,
  slideTitle: {
    color: "#FFFFFF",
    marginBottom: spacing.md,
    textAlign: "center",
  } as TextStyle,
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  } as ViewStyle,
  memberName: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: "center",
  } as TextStyle,
  amount: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
    marginBottom: spacing.sm,
  } as TextStyle,
  label: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  } as TextStyle,
  categoryLabel: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: spacing.md,
  } as TextStyle,
  budgetStats: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  budgetLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: spacing.xs,
  } as TextStyle,
  budgetAmount: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
  } as TextStyle,
  progressBarContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  } as ViewStyle,
  progressFill: {
    height: "100%" as any,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  } as ViewStyle,
  budgetGrid: {
    flexDirection: "row",
    gap: spacing.md,
  } as ViewStyle,
  budgetGridItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
  } as ViewStyle,
  gridLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginBottom: spacing.xs,
  } as TextStyle,
  gridAmount: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  } as TextStyle,
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  } as ViewStyle,
  summaryGridItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
  } as ViewStyle,
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  } as ViewStyle,
  dateText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  } as TextStyle,
  bottom: {
    paddingBottom: spacing.xl,
  } as ViewStyle,
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  } as ViewStyle,
  indicator: {
    height: 8,
    borderRadius: 4,
  } as ViewStyle,
  navigationButtons: {
    flexDirection: "row",
    gap: spacing.md,
  } as ViewStyle,
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  prevButton: {
    borderWidth: 2,
    borderColor: colors.border.light,
  } as ViewStyle,
  nextButton: {
    backgroundColor: colors.primary,
  } as ViewStyle,
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  } as TextStyle,
  nextButtonText: {
    color: "#FFFFFF",
  } as TextStyle,
  buttonDisabled: {
    opacity: 0.4,
  } as ViewStyle,
  buttonDisabledText: {
    color: colors.text.secondary,
  } as TextStyle,
});
