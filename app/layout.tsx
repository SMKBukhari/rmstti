import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "@/app/api/cron/escalationCron";

import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "HRMS-TTI | Home",
  description: "A Human Resource Management System for TTI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        // className={`${roboto.className} antialiased bg-[#f1f1f1] dark:bg-[#1A1A1A] overflow-hidden`}
        className={`${roboto.className} antialiased`}
      >
        <Providers>
          <main>{children}</main>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
