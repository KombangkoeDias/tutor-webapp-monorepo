"use client";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "./login-context";
import { useEffect } from "react";

export function useAuthRedirect() {
  const router = useRouter();
  const { loggedIn, isLoading } = useLoggedIn(); // Example auth state

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      router.push("/login"); // Redirect if user is not authenticated
    }
  }, [isLoading, loggedIn]);
}
