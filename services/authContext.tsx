import { router } from 'expo-router';
import { useState, useContext, createContext, useEffect } from 'react';
import { getSession, saveSession, deleteSession } from './useStorage';
import { login, signup } from "@/services/api";
import { registerSessionHandler } from './sessionGlobalSingleton';
import { toast } from "./toastService";

const AuthContext = createContext({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  session: null,
  user: null,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const signIn = (email, password) => {
    login(email, password)
      .then((response) => {
        const token = response.data.auth_token;
        const user = response.data.user;
        saveSession(token, user).then(() => {
          setSession({
            token,
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(user);
          toast('Login successful', 'success');
          router.replace("/(tabs)/home");
        });
      })
      .catch((error) => {
        console.log(error);
        toast(error.response?.data?.message || 'Login failed. Please check your credentials.');
      });
  };

  const signUp = (first_name, last_name, email, password, password_confirmation) => {
    signup(first_name, last_name, email, password, password_confirmation)
      .then((response) => {
        const token = response.data.auth_token;
        const user = response.data.user;
        saveSession(token, user).then(() => {
          setUser(user);
          setSession({
            token,
            headers: { Authorization: `Bearer ${token}` }
          });
          toast('Account created successfully', 'success');
          router.replace("/(tabs)/home");
        });
      })
      .catch((error) => {
        console.log(error);
        toast(error.response?.data?.message || 'Signup failed. Please try again.');
      });
  };

  const getJWT = () => {
    return session;
  }

  const signOut = () => {
    deleteSession();
    setSession(null);
    setUser(null);
  };

  useEffect(() => {
    registerSessionHandler(getJWT);
  }, [getJWT]);


  useEffect(() => {
    const fetchToken = async () => {
      const { token, user, headers } = await getSession();

      if (headers.Authorization) {
        setUser(user);
        setSession({
          token,
          headers: headers
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
        session,
        user
      }}>
      {children}
    </AuthContext.Provider>
  );
}