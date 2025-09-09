"use client";

import { Button } from "~/components/ui/button";
import { createAuthClient } from "better-auth/client";
import { useCallback } from "react";

const authClient = createAuthClient();

export default function LoginPage() {
  const handleGoogle = useCallback(async () => {
    await authClient.signIn.social({ provider: "google" });
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Button onClick={handleGoogle}>Sign in with Google</Button>
    </div>
  );
}


