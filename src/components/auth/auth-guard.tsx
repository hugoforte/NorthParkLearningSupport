"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import logger from "@/lib/logger";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.debug("AuthGuard: User not authenticated, redirecting to home");
      router.push("/?redirect=" + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-400">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Show children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
