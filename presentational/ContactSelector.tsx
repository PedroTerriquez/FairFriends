import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Avatar from './Avatar';
import { colors, spacing } from '@/theme';

interface Contact {
  id: number | string;
  name?: string;
  first_name?: string;
  email?: string;
}

interface ContactSelectorProps {
  label: string;
  contacts: Contact[];
  selectedContactId: number | string | null;
  onSelectContact: (contactId: number | string) => void;
  showToggle?: boolean;
  maxHeight?: number;
}

export default function ContactSelector({
  label,
  contacts,
  selectedContactId,
  onSelectContact,
  showToggle = true,
  maxHeight = 300,
}: ContactSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSelectContact = (contactId: number | string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectContact(contactId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {showToggle && (
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.toggleLeft}>
            <Ionicons
              name="people-outline"
              size={20}
              color={colors.text.primary}
            />
            <Text style={styles.toggleText}>
              {isExpanded ? 'Hide Contacts' : 'Show Contacts'}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      )}

      {isExpanded && (
        <ScrollView
          style={[styles.contactsList, { maxHeight }]}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          nestedScrollEnabled={true}
        >
          {contacts.map((contact) => {
            const isSelected = selectedContactId === contact.id;
            return (
              <TouchableOpacity
                key={contact.id}
                testID={`contact-selector-row-${contact.id}`}
                style={styles.contactItem}
                onPress={() => handleSelectContact(contact.id)}
                activeOpacity={0.7}
              >
                <Avatar name={contact.first_name || contact.name} size={48} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.first_name || contact.name}</Text>
                  {contact.email && (
                    <Text style={styles.contactEmail}>{contact.email}</Text>
                  )}
                </View>
                <View style={[
                  styles.radioButton,
                  isSelected && styles.radioButtonSelected
                ]}>
                  {isSelected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  contactsList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
