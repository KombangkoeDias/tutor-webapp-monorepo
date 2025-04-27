"use client";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import { LoggedInProvider } from "@/components/hooks/login-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConstantProvider } from "@/components/hooks/constant-context";
import { Suspense } from "react";
import { LocationConstantProvider } from "@/components/hooks/location-context";
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
          <LocationConstantProvider>
            <html>
              <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;700&display=swap"
                  rel="stylesheet"
                />
                <link rel="icon" href="https://i.ibb.co/99Kgt3d2/favicon.png" />
                <title>Job Tutor Dream</title>
              </head>
              {/* className="bg-[#fff0fe]" */}
              <body>
                <div className="flex flex-col">
                  <Toaster position="bottom-right" />
                  {/* Add Header */}
                  <Header />
                  <main className="flex-1 mb-2 mt-2 mr-2 ml-2">
                    <Suspense fallback={<div>Loading...</div>}>
                      {/* Main content */}
                      {children}
                    </Suspense>
                  </main>
                  {/* Add Footer */}
                  <Footer />
                </div>
              </body>
            </html>
          </LocationConstantProvider>
        </ConstantProvider>
      </LoggedInProvider>
    </QueryClientProvider>
  );
}
