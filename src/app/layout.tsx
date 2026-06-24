import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

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
      <head>
        <meta name="next-public-mapbox-access-token" content={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''} />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
