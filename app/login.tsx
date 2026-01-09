import { Text, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Button } from "react-native";
import { useState } from 'react';
import { useSession } from '../services/authContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from "@/services/ToastContext";
import baseStyles from "@/presentational/BaseStyles";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_USER);
  const [password, setPassword] = useState(process.env.EXPO_PUBLIC_PASSWORD);

  const handleLogin = () => {
    if (!email || !password) {
      showToast(t('login.please_fill_in'));
      return;
    }
    signIn(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.viewContainerFull}>
          <View style={[baseStyles.center, { marginTop: 100 }]}>
            <Ionicons name="people" size={80} color="#2F66FF" />
            <Text style={[baseStyles.title32, baseStyles.blueLogo]}>FairFriends</Text>
            <Text style={[baseStyles.label17, baseStyles.graySubtitle]}>{ t('login.split_expenses_with_friends') }</Text>
            {process.env.NODE_ENV === 'development' && (
              <Button
                title="Change user"
                onPress={() => {
                  setEmail(process.env.EXPO_PUBLIC_USER.replace(/1/g, '2'));
                }}
              />
            )}
          </View>

          <View style={baseStyles.center}>
            <View style={baseStyles.fullWidth}>
              <TextInput
                style={baseStyles.input}
                placeholder={t('login.email')}
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="none"
                secureTextEntry={false}
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder={t('login.password')}
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="off"
                textContentType="password"
              />
            </View>
            <TouchableOpacity
              style={baseStyles.loginButton}
              onPress={handleLogin}
            >
              <Ionicons name="log-in" size={24} color="white" />
              <Text style={[baseStyles.textWhite, baseStyles.title17]}>{t('login.login_button')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[baseStyles.alignItemsCenter, { marginBottom: 20 }]}>
            <Text style={[baseStyles.label14, baseStyles.graySubtitle]}>{t('login.no_account')}</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[baseStyles.link, baseStyles.boldText]}>{t('login.sign_up')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
