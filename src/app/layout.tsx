import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/ui/bottom-nav";

export const metadata: Metadata = {
  title: "Артефакты",
  description: "Собирай микро-доказательства действий. Снижай неопределённость.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Артефакты",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#18181b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-dvh">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
