"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import logger from "@/lib/logger";

interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
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
  const { signIn, signOut } = useAuthActions();
  
  // Query the current user from Convex Auth
  const user = useQuery(api.auth.getCurrentUser);
  const createOrLinkTeacher = useMutation(api.auth.createOrLinkTeacher);
  
  const isLoading = user === undefined;
  const isAuthenticated = user !== null && user !== undefined;

  // Create or link teacher when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      logger.debug("AuthProvider: User authenticated, creating/linking teacher");
      void createOrLinkTeacher().catch((error) => {
        logger.error("AuthProvider: Failed to create/link teacher:", error);
      });
    }
  }, [isAuthenticated, user, createOrLinkTeacher]);

  const handleSignIn = () => {
    logger.debug("AuthProvider: Starting Google sign-in");
    void signIn("google");
  };

  const handleSignOut = () => {
    logger.debug("AuthProvider: Signing out");
    void signOut();
  };

  const refreshSession = async () => {
    // Convex Auth handles session refresh automatically
    logger.debug("AuthProvider: Session refresh requested (handled automatically by Convex Auth)");
  };

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
