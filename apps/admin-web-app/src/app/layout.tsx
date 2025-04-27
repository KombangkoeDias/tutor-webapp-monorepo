"use client";
import "./globals.css";
import { LoggedInProvider } from "@/components/hooks/login-context";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConstantProvider } from "@/components/hooks/constant-context";
import { Suspense } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent auto-refetch on focus
      refetchOnReconnect: false, // Prevent refetch on network reconnect
      retry: 0, // Retry failed requests twice before erroring
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoggedInProvider>
        <ConstantProvider>
          <html>
            <head>
              <link rel="icon" href="https://i.ibb.co/99Kgt3d2/favicon.png" />
              <title>Job Tutor Dream</title>
            </head>
            <body>
              <div className="flex flex-col">
                <Suspense fallback={<div>Loading...</div>}>
                  <Toaster position="bottom-right" />
                  {/* Add Header */}
                  <Header />
                  <main className="flex-1 mb-2 mt-2 mr-2 ml-2">
                    {/* Main content */}
                    {children}
                  </main>
                  {/* Add Footer */}
                </Suspense>
              </div>
            </body>
          </html>
        </ConstantProvider>
      </LoggedInProvider>
    </QueryClientProvider>
  );
}
