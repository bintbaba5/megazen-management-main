import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import { SessionProvider } from "next-auth/react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Megazen";
const APP_DEFAULT_TITLE = "Megazen Inventory Management System";
const APP_TITLE_TEMPLATE = "%s - Megazen";
const APP_DESCRIPTION = "Megazen Inventory Management System";
export const metadata: Metadata = {
  title: "Megazen",
  description: "Megazen Inventory Management System",
  icons: {
    icon: "/favicon/android-chrome-192x192.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Megazen",
    statusBarStyle: "black-translucent",
    startupImage: [
      "/favicon/apple-touch-startup-image-640x1136.png",
      {
        url: "/favicon/apple-touch-startup-image-640x960.png",
        media: "(device-width: 320px) and (device-height: 480px)",
      },
      {
        url: "/favicon/apple-touch-startup-image-750x1334.png",
        media: "(device-width: 375px) and (device-height: 667px)",
      },
      {
        url: "/favicon/apple-touch-startup-image-1242x2208.png",
        media: "(device-width: 621px) and (device-height: 1104px)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <Toaster />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
