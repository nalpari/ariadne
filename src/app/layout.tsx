import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { AnonBootstrap } from "@/app/(auth)/anon-bootstrap";
import { AppShell } from "@/components/shell/app-shell";
import { ErrorBoundary } from "@/components/shell/error-boundary";
import { ThemeProvider } from "@/components/shell/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ariadne",
  description: "AI 기반 E2E 테스트 자동화 애플리케이션",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <AnonBootstrap />
            </Suspense>
            <AppShell>{children}</AppShell>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
