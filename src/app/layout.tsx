import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TranslationProvider } from "@/i18n";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Medicine Heroes",
  description: "Help your child take medicine with rewards, games, and calming tools",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-blue-50 to-purple-50 min-h-dvh">
        <TranslationProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </TranslationProvider>
      </body>
    </html>
  );
}
