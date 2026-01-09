import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../services/authContext';
import { useToast } from '@/services/ToastContext';
import baseStyles from "@/presentational/BaseStyles";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { t } = useTranslation();
  const { signUp } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      showToast(t('signup.passwords_must_match'));
      return;
    }
    signUp(firstName, lastName, email, password, confirmPassword);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={baseStyles.viewContainerFull}>
          <View style={baseStyles.center}>
            <Ionicons name="people" size={80} color="#2F66FF" />
            <Text style={[baseStyles.title32, baseStyles.blueLogo]}>FairFriends</Text>
            <Text style={[baseStyles.label17, baseStyles.graySubtitle]}>Split expenses with friends</Text>
          </View>

          <View style={baseStyles.center}>
            <View style={baseStyles.fullWidth}>
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('signup.first_name')}
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('signup.last_name')}
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('signup.email')}
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('signup.password')}
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('signup.confirm_password')}
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
              {error && <Text style={baseStyles.errorText}>{error}</Text>}
            </View>
            <TouchableOpacity 
              style={baseStyles.loginButton}
              onPress={handleSignUp}
            >
              <Ionicons name="person-add" size={24} color="white" />
              <Text style={[baseStyles.textWhite, baseStyles.title17]}>{t('signup.signup_button')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[baseStyles.alignItemsCenter, { marginBottom: 20 }]}>
            <Text style={[baseStyles.label14, baseStyles.graySubtitle]}>{t('signup.have_account')}</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[baseStyles.link, baseStyles.boldText]}>{t('signup.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}