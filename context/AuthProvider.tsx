import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error?: Error }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error?: Error }>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
  signInWithGithub: () => Promise<{ error?: Error }>;
  signOut: () => Promise<{ error?: Error }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signInWithEmail(email: string, password: string) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return {};
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Login failed");
          return { error };
        }
      },
      async signOut() {
        try {
          await firebaseSignOut(auth);
          return {};
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("Sign out failed");
          return { error };
        }
      },
      async signUpWithEmail(email: string, password: string) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return {};
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Signup failed");
          return { error };
        }
      },
      async resetPassword(email: string) {
        try {
          await sendPasswordResetEmail(auth, email);
          return {};
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Reset failed");
          return { error };
        }
      },
      async signInWithGithub() {
        try {
          const provider = new GithubAuthProvider();
          await signInWithPopup(auth, provider);
          return {};
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error("GitHub login failed");
          return { error };
        }
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
