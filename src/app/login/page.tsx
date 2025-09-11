"use client";

import { Button } from "~/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

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

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-6 text-3xl font-bold text-white">Sign In</h1>
        <p className="mb-8 text-gray-400">Sign in to access NorthPark Learning Support</p>
        <Button onClick={signIn} size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}


