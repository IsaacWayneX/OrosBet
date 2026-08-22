import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ActivityModal } from "@/components/ui/ActivityModal";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oros Web",
  description: "Live sports prediction markets on Monad",
};

export default function RootLayout({ children }: Readonly<{ children: import("react").ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Suspense fallback={<aside className="fixed left-0 top-[60px] hidden h-[calc(100vh-60px)] w-[260px] bg-background-sidebar border-r border-border/40 lg:flex" />}>
            <Sidebar />
          </Suspense>
          <div className="page-shell flex min-h-[calc(100vh-60px)] lg:pl-[260px]">
            <main className="flex-1 px-4 py-6 lg:px-8">
              {children}
            </main>
          </div>
          <MobileNav />
          <ActivityModal />
        </div>
      </body>
    </html>
  );
}
