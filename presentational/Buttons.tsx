import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';
import { useTranslation } from "react-i18next";
import baseStyles from "./BaseStyles";
import { colors, spacing, shadows } from '@/theme';

const pressedStyle = { opacity: 0.85, transform: [{ scale: 0.98 }] };

export default function AcceptButton({ onPressAction, testID }) {
    const { t } = useTranslation();
    return (
        <Pressable
            testID={testID}
            style={({ pressed }) => [styles.actionButton, styles.acceptButton, pressed && pressedStyle]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }}>
            <Ionicons name="checkmark" size={20} color={colors.surface} />
            <Text style={styles.acceptButtonText}>{t('notifications.accept')}</Text>
        </Pressable>

    )
}

export function RejectButton({ onPressAction, testID }) {
    const { t } = useTranslation();
    return (
        <Pressable
            testID={testID}
            style={({ pressed }) => [styles.actionButton, styles.rejectButton, pressed && pressedStyle]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }}>
            <Ionicons name="close" size={20} color={colors.text.primary} />
            <Text style={styles.rejectButtonText}>{t('notifications.reject')}</Text>
        </Pressable>
    )
}

export function AddContactButton({ onPressAction, testID }) {
    const { t } = useTranslation();
    return (
        <Pressable
            testID={testID}
            style={({ pressed }) => [styles.actionButton, styles.acceptButton, pressed && pressedStyle]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }}>
            <MaterialIcons name="person-add" size={20} color={colors.surface} />
            <Text style={styles.acceptButtonText}>{t('contactForm.add')}</Text>
        </Pressable>
    )
}

export function CancelRequestButton({ onPressAction }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.actionButton, styles.rejectButton, pressed && pressedStyle]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }}>
            <Ionicons name="close" size={20} color={colors.text.primary} />
            <Text style={styles.rejectButtonText}>Cancel Request</Text>
        </Pressable>
    )
}

export function InSplitButton({ onPressAction }) {
    return (
        <Pressable
            style={({ pressed }) => [baseStyles.circleButton, baseStyles.grayBG, pressed && pressedStyle]}
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }}>
            <MaterialIcons name="call-split" size={23} color="white" />
        </Pressable>
    )
}

export function PendingButton({ onPressAction }) {
    return (
        <Pressable
            style={({ pressed }) => [baseStyles.circleButton, baseStyles.warningBG, pressed && pressedStyle]}
            onPress={onPressAction}>
            <Ionicons name="warning" size={21} color="white" />
        </Pressable>
    )
}

export function EditButton({ onPressAction }) {
    return (
        <Pressable
            style={({ pressed }) => [baseStyles.circleButton, baseStyles.warningBG, pressed && pressedStyle]}
            onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPressAction();
            }} >
            <MaterialIcons name="edit" size={21} color="white" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.ssm,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border.light,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  acceptButton: {
    backgroundColor: colors.financial.positive,
    ...shadows.sm,
  },
});
