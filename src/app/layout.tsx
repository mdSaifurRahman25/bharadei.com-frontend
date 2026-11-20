import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BharaDei.com — Everything You Need, Ready to Rent.",
  description:
    "BharaDei.com — Rent what you need, lend what you own. Bangladesh’s smart equipment rental marketplace for cameras, tools, event gear, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Suspense
              fallback={
                <header className="h-[80px] border-b border-[var(--line)] bg-[var(--bg)]" />
              }
            >
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
