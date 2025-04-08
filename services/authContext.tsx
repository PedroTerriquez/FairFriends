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

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session: Session | null;
}>({
  signIn: () => null,
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

  const signIn = (email: string, password: string) => {
    axios.post(`${process.env.EXPO_PUBLIC_API}/login`, { email, password })
      .then((response) => {
        const token = response.data.auth_token;
        saveToken(token).then(() => {
          setSession({
            token,
            headers: { Authorization: `Bearer ${token}` }
          });
          router.replace("/(tabs)/home");
        });
      })
      .catch((error) => {
        console.log(error);
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
        signOut,
        session
      }}>
      {children}
    </AuthContext.Provider>
  );
}