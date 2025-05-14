// src/app/ClientLayout.tsx
"use client";

import { Toaster } from "react-hot-toast";
import { LoggedInProvider } from "@/components/hooks/login-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConstantProvider } from "@/components/hooks/constant-context";
import { Suspense } from "react";
import { LocationConstantProvider } from "@/components/hooks/location-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent auto-refetch on focus
      refetchOnReconnect: false, // Prevent refetch on network reconnect
      retry: 0, // Retry failed requests twice before erroring
    },
  },
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoggedInProvider>
        <ConstantProvider>
          <LocationConstantProvider>
            <div className="flex flex-col">
              <Toaster position="bottom-right" />
              <Header />
              <main className="flex-1 mb-2 mt-2 mr-2 ml-2">
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              </main>
              <Footer />
            </div>
          </LocationConstantProvider>
        </ConstantProvider>
      </LoggedInProvider>
    </QueryClientProvider>
  );
}
