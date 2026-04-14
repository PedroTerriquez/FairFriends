import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  testID?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ label, value, onChangeText, placeholder, children, testID }) => {
  return (
      <View>
        <Text style={styles.label}>{label}</Text>
          <View style={styles.container}>
              {children}
              <TextInput
                  style={styles.textInput}
                  value={value}
                  onChangeText={onChangeText}
                  placeholder={placeholder}
                  placeholderTextColor={colors.text.tertiary}
                  testID={testID}
              />
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});

export default CustomTextInput;
