import { Text, View } from "react-native";
import { useSession } from '../services/authContext';

export default function Login() {
  const { signIn } = useSession();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login</Text>
      <Text onPress={
        () => {signIn(process.env.EXPO_PUBLIC_USER, process.env.EXPO_PUBLIC_PASSWORD)}
        }
        >Click to Login</Text>
      <Text>{process.env.EXPO_PUBLIC_USER}</Text>
    </View>
  );
}
