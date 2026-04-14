import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import baseStyles from "./BaseStyles";
import { colors, spacing, shadows } from '@/theme';

export default function AcceptButton({ onPressAction, testID }) {
    const { t } = useTranslation();
    return (
        <Pressable
            testID={testID}
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onPressAction}>
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
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onPressAction}>
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
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onPressAction}>
            <MaterialIcons name="person-add" size={20} color={colors.surface} />
            <Text style={styles.acceptButtonText}>{t('contactForm.add')}</Text>
        </Pressable>
    )
}

export function CancelRequestButton({ onPressAction }) {
    return (
        <Pressable
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onPressAction}>
            <Ionicons name="close" size={20} color={colors.text.primary} />
            <Text style={styles.rejectButtonText}>Cancel Request</Text>
        </Pressable>
    )
}

export function InSplitButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.grayBG]}
            onPress={onPressAction}>
            <MaterialIcons name="call-split" size={23} color="white" />
        </Pressable>
    )
}

export function PendingButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.warningBG]}
            onPress={onPressAction}>
            <Ionicons name="warning" size={21} color="white" />
        </Pressable>
    )
}

export function EditButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.warningBG]}
            onPressIn={() => onPressAction()} >
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