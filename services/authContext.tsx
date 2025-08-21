import { router } from 'expo-router';
import { useState, useContext, createContext, useEffect } from 'react';
import { getToken, saveToken, deleteToken } from './useStorage';
import { login, signup } from "@/services/api";
import { registerSessionHandler } from './sessionGlobalSingleton';

const AuthContext = createContext({
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

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  const signIn = (email, password, showToast) => {
    login(email, password)
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

  const signUp = (first_name, last_name, email, password, password_confirmation, showToast) => {
    signup(first_name, last_name, email, password, password_confirmation)
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

  const getJWT = () => {
    return session;
  }

  const signOut = () => {
    deleteToken();
    setSession(null);
  };

  useEffect(() => {
    registerSessionHandler(getJWT);
  }, [getJWT]);


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