import { StyleSheet } from 'react-native';
import { spacing, typography, colors, shadows } from '../theme';

/**
 * Base Styles - Refactored to use Design System Tokens
 *
 * This file now uses centralized design tokens from /theme directory.
 * All hardcoded values have been replaced with semantic tokens.
 */

const baseStyles = StyleSheet.create({
    // Containers
    generalBackground: {
        backgroundColor: colors.background,
    },
    viewContainerFull: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    viewContainerFullScrollable: {
        flexGrow: 1,
        backgroundColor: colors.surfaceVariant,
        padding: spacing.sm,
    },
    containerCard: {
        backgroundColor: colors.surface,
        borderRadius: 15,
        padding: spacing.sm,
        borderWidth: 0.3,
        borderColor: colors.border.light,
        marginVertical: spacing.sm,
    },
    viewRowWithSpace: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    fullWidth: {
        width: '90%',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    columnCenter: {
        flexDirection: "column",
        alignItems: "center",
    },
    alignItemsCenter: {
        alignItems: "center",
    },

    // Typography - Using design system tokens
    titleBold40: typography.display2,
    title32: typography.h1,
    title26: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: '700' as const,
    },
    title24: typography.h2,
    title20: typography.h3,
    title17: typography.h4,
    title15: {
        ...typography.body,
        fontWeight: '700' as const,
    },
    label17: typography.bodyLarge,
    label14: typography.bodySmall,
    smallLabel: {
        ...typography.caption,
        marginBottom: spacing.sm,
    },

    // Text Characteristics
    textCenter: {
        textAlign: "center" as const,
    },
    textGray: {
        color: colors.text.secondary,
    },
    textLightBlack: {
        color: colors.text.primary,
    },
    textBlack: {
        color: colors.text.primary,
    },
    textWhite: {
        color: colors.text.inverse,
    },
    boldText: {
        fontWeight: "bold" as const,
    },
    greenText: {
        color: colors.financial.positive,
        fontWeight: "bold" as const,
    },
    postiveValueText: {
        color: colors.financial.positive,
    },
    negativeValueText: {
        color: colors.financial.negative,
    },
    errorText: {
        color: colors.error,
    },
    redText: {
        color: colors.financial.negative,
        fontWeight: "bold" as const,
    },
    orangeText: {
        color: colors.financial.pending,
        fontWeight: "bold" as const,
    },
    link: {
        color: colors.primary,
    },

    // Backgrounds - Using design system colors
    redBG: {
        backgroundColor: colors.financial.negative,
    },
    blackBG: {
        backgroundColor: colors.text.primary,
    },
    greenBG: {
        backgroundColor: colors.financial.positive,
    },
    blueBG: {
        backgroundColor: colors.primary,
    },
    warningBG: {
        backgroundColor: colors.warning,
    },
    successBG: {
        backgroundColor: colors.success,
    },
    dangerBG: {
        backgroundColor: colors.error,
    },
    lightGreenBG: {
        backgroundColor: colors.financial.positiveLight,
    },
    lightBlueBG: {
        backgroundColor: colors.primaryLight,
    },
    grayBG: {
        backgroundColor: colors.text.disabled,
    },
    lightRedBG: {
        backgroundColor: colors.financial.negativeLight,
    },
    lightOrangeBG: {
        backgroundColor: colors.financial.pendingLight,
    },
    blueLogo: {
        color: colors.primary,
    },
    graySubtitle: {
        color: colors.text.secondary,
    },

    // Card Styles - Using design system tokens
    card: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginVertical: spacing.sm,
        borderRadius: 15,
        overflow: 'visible',
        ...shadows.sm,
    },
    cardRead: {
        borderColor: colors.border.light,
    },
    cardUnread: {
        backgroundColor: colors.primaryLight,
    },
    cardClose: {
        shadowColor: colors.success,
    },
    cardPending: {
        shadowColor: colors.financial.pending,
    },
    cardAccepted: {
        shadowColor: colors.success,
    },
    cardRejected: {
        shadowColor: colors.financial.negative,
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        ...typography.body,
        fontWeight: "bold" as const,
        marginBottom: 2,
    },
    cardSubtitle: typography.bodySmall,
    cardDate: {
        ...typography.caption,
        color: colors.text.secondary,
    },

    // Buttons - Using design system tokens
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.lg,
    },
    button: {
        padding: spacing.sm,
        borderRadius: 8,
        alignItems: "center" as const,
        marginHorizontal: spacing.sm,
        color: colors.text.inverse,
    },
    circleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: spacing.sm,
    },
    loginButton: {
        flexDirection: 'row' as const,
        backgroundColor: colors.primary,
        paddingHorizontal: 30,
        paddingVertical: spacing.md,
        borderRadius: 25,
        alignItems: 'center' as const,
        ...shadows.md,
    },
    saveButton: {
        backgroundColor: colors.success,
    },
    cancelButton: {
        backgroundColor: colors.error,
    },
    normalButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        color: colors.text.inverse,
        fontSize: 16,
    },
    buttonWithIcon: {
        flexDirection: 'column' as const,
        padding: spacing.sm,
        gap: spacing.xs,
        minWidth: 75,
        borderRadius: 10,
        alignItems: 'center' as const,
        backgroundColor: colors.surface,
    },

    // Rest of utilities
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },
    avatarText: {
        color: colors.text.inverse,
        ...typography.body,
        fontWeight: "bold" as const,
    },
    marginLeft10: {
        marginLeft: spacing.sm,
    },
    marginLeft5: {
        marginLeft: spacing.xs,
    },

    // Inputs - Using design system tokens
    input: {
        borderWidth: 1,
        borderColor: colors.border.light,
        borderBottomWidth: 1,
        borderRadius: 8,
        padding: spacing.md,
        fontSize: 16,
        marginVertical: spacing.sm,
    },
    grayInput: {
        backgroundColor: colors.surfaceVariant,
        borderColor: colors.border.light,
        borderWidth: 1,
        padding: spacing.md,
        borderRadius: 10,
        marginBottom: spacing.md,
        fontSize: 16,
    },
    picker: {
        height: 50,
        marginBottom: spacing.lg,
    },
    disabledInput: {
        backgroundColor: colors.surfaceVariant,
    },
    inputError: {
        borderColor: colors.error,
    },

    // Badges - Using design system tokens
    badge: {
        borderRadius: 10,
        padding: spacing.sm,
    },
    quantityBadge: {
        borderRadius: 15,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    floatingBadgeForCard: {
        position: "absolute" as const,
        top: spacing.sm,
        width: 'auto' as const,
        height: 30,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        borderRadius: 20,
        paddingHorizontal: spacing.sm,
        flexDirection: "row" as const,
    },
    floatingButton: {
        position: "absolute" as const,
        bottom: spacing.lg,
        right: spacing.lg,
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 30,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        ...shadows.lg,
        zIndex: 10,
    },

    // Search and Tab Bar
    searchBarInput: {
        backgroundColor: colors.surface,
        borderRadius: 15,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border.default,
        padding: spacing.sm,
        marginVertical: spacing.sm,
        width: '100%',
    },
    tabBarContainer: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 20,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        borderColor: colors.border.light,
        borderWidth: 0.5,
    },
    tabBarActive: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        borderColor: colors.border.light,
        borderWidth: 1,
    },
    tabBarTextActive: {
        color: colors.text.primary,
    },
    tabBarInactive: {
        flex: 1,
        borderRadius: 20,
        alignItems: "center" as const,
        justifyContent: "center" as const,
    },
    tabBarTextInactive: {
        color: colors.text.secondary,
    },

    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        padding: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: 10,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },

    // Payment Screen Styles
    money: {
        fontSize: 70,
        fontWeight: 'bold' as const,
        color: colors.text.primary,
    },
    keypadRow: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        gap: spacing.sm,
    },
    keypadButton: {
        width: 80,
        height: 80,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 40,
        margin: 2,
    },
    keypadText: {
        fontSize: 32,
        color: colors.text.primary,
    },

    // Table
    table: {
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 10,
        overflow: 'hidden',
        padding: spacing.md,
    },
    tableRow: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        paddingVertical: spacing.xs,
        alignItems: "center" as const,
    },

    // Header
    header: {
        backgroundColor: colors.surface,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    headerContent: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },
});

export default baseStyles;
