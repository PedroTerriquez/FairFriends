import { Text, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../services/authContext';
import { useToast } from '@/services/ToastContext';
import baseStyles from "@/presentational/BaseStyles";

export default function SignUp() {
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
      showToast('Passwords do not match');
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
                placeholder="First Name"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder="Last Name"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <TextInput
                style={baseStyles.grayInput}
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
                autoComplete="password-new"
              />
              <TextInput
                style={baseStyles.grayInput}
                placeholder="Confirm Password"
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
              <Text style={[baseStyles.textWhite, baseStyles.title17]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={[baseStyles.alignItemsCenter, { marginBottom: 20 }]}>
            <Text style={[baseStyles.label14, baseStyles.graySubtitle]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[baseStyles.link, baseStyles.boldText]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}