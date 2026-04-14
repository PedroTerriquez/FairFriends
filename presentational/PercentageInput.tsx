import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

interface PercentageInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  subtitle?: string;
  error?: string;
}

export default function PercentageInput({
  label,
  value,
  onChangeText,
  placeholder = '0',
  subtitle,
  error,
}: PercentageInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <Text style={styles.percentSymbol}>%</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputContainerError: {
    borderColor: colors.financial.negative,
  },
  percentSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: colors.financial.negative,
    marginTop: spacing.xs,
  },
});
