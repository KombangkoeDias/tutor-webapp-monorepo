// src/app/ClientLayout.tsx
"use client";

import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConstantProvider } from "@/chulatutordream/components/hooks/constant-context";

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
      <ConstantProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Toaster position="bottom-right" />
          {children}
          <Footer />
        </Suspense>
      </ConstantProvider>
    </QueryClientProvider>
  );
}
