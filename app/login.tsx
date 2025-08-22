import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Button } from "react-native";
import { useState } from 'react';
import { useSession } from '../services/authContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from "@/services/ToastContext";
import baseStyles from "@/presentational/BaseStyles";

export default function Login() {
  const { signIn } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_USER);
  const [password, setPassword] = useState(process.env.EXPO_PUBLIC_PASSWORD);

  const handleLogin = () => {
    if (!email || !password) {
      showToast('Please fill in all fields');
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
            <Text style={[baseStyles.label17, baseStyles.graySubtitle]}>Split expenses with friends</Text>
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
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>
            <TouchableOpacity
              style={baseStyles.loginButton}
              onPress={handleLogin}
            >
              <Ionicons name="log-in" size={24} color="white" />
              <Text style={[baseStyles.textWhite, baseStyles.title17]}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={[baseStyles.alignItemsCenter, { marginBottom: 20 }]}>
            <Text style={[baseStyles.label14, baseStyles.graySubtitle]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[baseStyles.link, baseStyles.boldText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}