import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { SignalProvider } from "@/providers/SignalProvider";

export const metadata: Metadata = {
  title: "DDL Supplier Dashboard",
  description: "Direct Demand-to-Logistics Supplier Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SignalProvider>{children}</SignalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
