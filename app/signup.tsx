import { Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../services/authContext';
import { useToast } from '@/services/ToastContext';
import baseStyles from "@/presentational/BaseStyles";
import { useTranslation } from "react-i18next";
import { colors } from '@/theme';

export default function SignUp() {
  const { t } = useTranslation();
  const { signUp } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      showToast(t('signup.passwords_must_match'));
      return;
    }
    signUp(firstName, lastName, email, password, confirmPassword, phoneNumber);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={baseStyles.viewContainerFull}>
          <View style={baseStyles.center}>
            <Ionicons name="people" size={80} color={colors.primary} />
            <Text style={[baseStyles.title32, baseStyles.blueLogo]}>FairFriends</Text>
            <Text style={[baseStyles.label17, baseStyles.graySubtitle]}>{ t('signup.split_expenses_with_friends') }</Text>
          </View>

          <View style={baseStyles.center}>
            <View style={baseStyles.fullWidth}>
              <TextInput
                testID="signup-first-name"
                style={baseStyles.grayInput}
                placeholder={t('signup.first_name')}
                placeholderTextColor={colors.text.secondary}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                testID="signup-last-name"
                style={baseStyles.grayInput}
                placeholder={t('signup.last_name')}
                placeholderTextColor={colors.text.secondary}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <TextInput
                testID="signup-email"
                style={baseStyles.grayInput}
                placeholder={t('signup.email')}
                placeholderTextColor={colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TextInput
                testID="signup-phone-number"
                style={baseStyles.grayInput}
                placeholder={t('signup.phone_number')}
                placeholderTextColor={colors.text.secondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
              <Text style={[baseStyles.label14, baseStyles.graySubtitle, { marginBottom: 8, marginLeft: 4 }]}>
                {t('signup.phone_number_format')}
              </Text>
              <TextInput
                testID="signup-password"
                style={baseStyles.grayInput}
                placeholder={t('signup.password')}
                placeholderTextColor={colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
              <TextInput
                testID="signup-confirm-password"
                style={baseStyles.grayInput}
                placeholder={t('signup.confirm_password')}
                placeholderTextColor={colors.text.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>
            <Pressable
              testID="signup-submit"
              style={({ pressed }) => [
                baseStyles.loginButton,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={handleSignUp}
            >
              <Ionicons name="person-add" size={24} color="white" />
              <Text style={[baseStyles.textWhite, baseStyles.title17]}>{t('signup.signup_button')}</Text>
            </Pressable>
          </View>

          <View style={[baseStyles.alignItemsCenter, { marginBottom: 20 }]}>
            <Text style={[baseStyles.label14, baseStyles.graySubtitle]}>{t('signup.have_account')}</Text>
            <Pressable
              testID="signup-go-to-login"
              onPress={() => router.push('/login')}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <Text style={[baseStyles.link, baseStyles.boldText]}>{t('signup.login')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}