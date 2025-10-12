import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@purelife:user";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  heightCm: number;
  weightKg: number;
  goal: "lose" | "maintain" | "gain";
};

type StoredUser = AuthUser & {
  password: string;
};

type Credentials = {
  email: string;
  password: string;
};

type RegistrationPayload = Credentials & {
  name: string;
  heightCm: number;
  weightKg: number;
  goal: AuthUser["goal"];
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (creds: Credentials) => Promise<boolean>;
  signOut: () => Promise<void>;
  register: (payload: RegistrationPayload) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const delay = (ms: number) =>
  new Promise<void>((resolve: () => void) => {
    setTimeout(() => resolve(), ms);
  });

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);
        if (serialized) {
          const parsed = JSON.parse(serialized) as StoredUser;
          const { password: _ignored, ...publicUser } = parsed;
          setUser(publicUser);
        }
      } catch (error) {
        console.warn("Failed to restore user", error);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    await delay(600);
    try {
      const serialized = await AsyncStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return false;
      }
      const storedUser = JSON.parse(serialized) as StoredUser;
      if (storedUser.email !== email) {
        return false;
      }
      const verified = storedUser.password === password;
      if (!verified) {
        return false;
      }
      const { password: _ignored, ...publicUser } = storedUser;
      setUser(publicUser);
      return true;
    } catch (error) {
      console.warn("Sign-in failed", error);
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    await delay(400);
    await AsyncStorage.removeItem(STORAGE_KEY).catch((error: unknown) => {
      console.warn("Failed to clear user", error);
    });
    setUser(null);
  }, []);

  const register = useCallback(async (payload: RegistrationPayload) => {
    await delay(800);
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email: payload.email,
      name: payload.name,
      heightCm: payload.heightCm,
      weightKg: payload.weightKg,
      goal: payload.goal,
      password: payload.password
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      const { password: _ignored, ...publicUser } = newUser;
      setUser(publicUser);
      return true;
    } catch (error) {
      console.warn("Registration failed", error);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      register
    }),
    [loading, register, signIn, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
