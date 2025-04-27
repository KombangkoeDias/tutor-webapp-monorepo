"use client";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/footer";
import { ConstantProvider } from "@/chulatutordream/components/hooks/constant-context";
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
      <ConstantProvider>
        <html lang="en">
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;700&display=swap"
              rel="stylesheet"
            />
            <link rel="icon" href="/favicon.png" />
            <title>Chula Tutor Dream</title>
          </head>
          <body>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <Toaster position="bottom-right" />
              {children}
              <Footer />
            </Suspense>
          </body>
        </html>
      </ConstantProvider>
    </QueryClientProvider>
  );
}
