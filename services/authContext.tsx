import { router } from 'expo-router';
import { useState, useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { getToken, saveToken, deleteToken } from './useStorage';
import axios from 'axios';

type Session = {
  token: string | null;
  headers: {
    Authorization?: string;
  };
};

type AuthContextType = {
  signIn: (email: string, password: string, showToast: (message: string, type?: string) => void) => void;
  signUp: (first_name: string, last_name: string, email: string, password: string, password_confirmation: string, showToast: (message: string, type?: string) => void) => void;
  signOut: () => void;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  session: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = (email: string, password: string, showToast: (message: string, type?: string) => void) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/login`, { email, password })
      .then((response) => {
        const token = response.data.auth_token;
        saveToken(token).then(() => {
          setSession({
            token,
            headers: { Authorization: `Bearer ${token}` }
          });
          showToast('Login successful', 'success');
          router.replace("/(tabs)/home");
        });
      })
      .catch((error) => {
        console.log(error);
        showToast(error.response?.data?.message || 'Login failed. Please check your credentials.');
      });
  };

  const signUp = (first_name: string, last_name: string, email: string, password: string, password_confirmation: string, showToast: (message: string, type?: string) => void) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/users`, { first_name, last_name, email, password, password_confirmation })
      .then((response) => {
        const token = response.data.auth_token;
        saveToken(token).then(() => {
          setSession({
            token,
            headers: { Authorization: `Bearer ${token}` }
          });
          showToast('Account created successfully', 'success');
          router.replace("/(tabs)/home");
        });
      })
      .catch((error) => {
        console.log(error);
        showToast(error.response?.data?.message || 'Signup failed. Please try again.');
      });
  };

  const signOut = () => {
    deleteToken();
    setSession(null);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData.headers.Authorization) {
        const token = tokenData.headers.Authorization.replace('Bearer ', '');
        setSession({
          token,
          headers: tokenData.headers
        });
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session
      }}>
      {children}
    </AuthContext.Provider>
  );
}