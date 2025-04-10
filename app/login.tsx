import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSession } from '../services/authContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const { signIn } = useSession();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="people" size={80} color="#2F66FF" />
        <Text style={styles.appName}>FairFriends</Text>
        <Text style={styles.tagline}>Split expenses with friends</Text>
      </View>

      <View style={styles.loginContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => signIn(process.env.EXPO_PUBLIC_USER, process.env.EXPO_PUBLIC_PASSWORD)}
        >
          <Ionicons name="log-in" size={24} color="white" />
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F66FF',
    marginTop: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#2F66FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#2F66FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
