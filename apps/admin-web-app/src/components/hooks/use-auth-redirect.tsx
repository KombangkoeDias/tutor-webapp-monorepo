"use client";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "./login-context";
import { useEffect } from "react";

interface UseAuthRedirectOptions {
  disabled?: boolean;
}

export function useAuthRedirect(options?: UseAuthRedirectOptions) {
  const router = useRouter();
  const { loggedIn, isLoading } = useLoggedIn(); // Example auth state
  const disabled = options?.disabled ?? false;

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (!isLoading && !loggedIn) {
      router.push("/login"); // Redirect if user is not authenticated
    }
  }, [disabled, isLoading, loggedIn, router]);
}
