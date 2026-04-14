import { router } from 'expo-router';
import { useState, useContext, createContext, useEffect, ReactNode } from 'react';
import { getSession, saveSession, deleteSession, clearCache } from './useStorage';
import { login, signup, registerLogoutHandler } from "@/services/api";
import { setSession as setGlobalSession } from './sessionGlobalSingleton';
import { toast } from "./toastService";

interface Session {
  token: string;
  headers: { Authorization: string };
}

interface User {
  id: string;
  [key: string]: any;
}

interface AuthContextType {
  signIn: (email: string, password: string) => void;
  signUp: (first_name: string, last_name: string, email: string, password: string, password_confirmation: string, phone_number: string) => void;
  signOut: () => Promise<void>;
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = (email: string, password: string) => {
    login(email, password).then((response) => {
      if (!response) return;
      const token = response.data.auth_token;
      const user = response.data.user;
      saveSession(token, user).then(() => {
        const nextSession = {
          token,
          headers: { Authorization: `Bearer ${token}` }
        };
        setGlobalSession(nextSession);
        setSession(nextSession);
        setUser(user);
        toast('Login successful', 'success');
        router.replace("/(tabs)/home");
      });
    });
  };

  const signUp = (first_name: string, last_name: string, email: string, password: string, password_confirmation: string, phone_number: string) => {
    signup(first_name, last_name, email, password, password_confirmation, phone_number).then((response) => {
      if (!response) return;
      const token = response.data.auth_token;
      const user = response.data.user;
      saveSession(token, user).then(() => {
        const nextSession = {
          token,
          headers: { Authorization: `Bearer ${token}` }
        };
        setGlobalSession(nextSession);
        setUser(user);
        setSession(nextSession);
        toast('Account created successfully', 'success');
        router.replace("/(tabs)/home");
      });
    });
  };

  const signOut = async () => {
    setGlobalSession(null);
    setUser(null);
    setSession(null);

    try {
      await deleteSession();
    } catch (e) {
      console.warn('signOut: failed to delete persisted session', e);
    }
    clearCache();

    try {
      if ((router as any).canDismiss?.()) {
        (router as any).dismissAll();
      }
    } catch {}
    router.replace("/login");
  };

  useEffect(() => {
    registerLogoutHandler(signOut);
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { token, user, headers } = await getSession();

        if (user && token) {
          setGlobalSession({ token, headers });
          setUser(user);
          setSession({ token, headers });
        } else {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
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
        user,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}