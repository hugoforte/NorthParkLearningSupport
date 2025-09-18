"use client";

import { useAuth } from "@/components/auth/auth-context";
import { AuthenticatedHome } from "@/components/home/authenticated-home";
import { UnauthenticatedHome } from "@/components/home/unauthenticated-home";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
  return (
      <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
  }

  // Render appropriate home page based on authentication status
  return isAuthenticated ? <AuthenticatedHome /> : <UnauthenticatedHome />;
}
