"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createAuthClient } from "better-auth/client";
import logger from "@/lib/logger";

const auth = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      logger.debug("AuthProvider: Refreshing session");
      const session = await auth.getSession();
      const userData = session?.data?.user ?? null;
      
      setUser(userData);
      logger.debug("AuthProvider: Session refreshed", userData ? "authenticated" : "not authenticated");
    } catch (error) {
      logger.error("AuthProvider: Failed to refresh session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async () => {
    try {
      logger.debug("AuthProvider: Starting Google sign-in");
      await auth.signIn.social({ provider: "google" });
      
      // Wait a bit for the session to be established, then refresh
      setTimeout(() => {
        void refreshSession();
      }, 1500);
    } catch (error) {
      logger.error("AuthProvider: Sign-in failed:", error);
    }
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    try {
      logger.debug("AuthProvider: Signing out");
      await auth.signOut();
      setUser(null);
    } catch (error) {
      logger.error("AuthProvider: Sign-out failed:", error);
      // Still clear user state even if API call fails
      setUser(null);
    }
  }, []);

  // Initial session check
  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
