import { router } from 'expo-router';
import { useState, useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { getToken, saveToken, deleteToken } from './useStorage';
import axios from 'axios';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: object | null;
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

function signIn(email: string, password: string) {
  axios.post(`${process.env.EXPO_PUBLIC_API}/login`, { email, password },)
    .then((response) => {
      saveToken(response.data.auth_token).then(res => {
        router.replace("/home");
      });
    })
    .catch((error) => {
      console.log(error)
    });
}

function signout() {
  deleteToken();
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      console.log('Fetching session...');
      const token = await getToken();
      console.log('Session:', token);
      setSession(token);
    };

    fetchToken();
  },[]);

  return (
    <AuthContext.Provider
      value={{
        signIn: signIn,
        signOut: signout,
        session
      }}>
      {children}
    </AuthContext.Provider>
  );
}