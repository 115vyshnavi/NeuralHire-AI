import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "NeuralHire AI — Beyond Resumes",
  description: "AI-Powered Human Intelligence Platform",
  keywords: [
    "NeuralHire",
    "AI Recruitment",
    "Human Intelligence",
    "AI Hiring",
    "Talent Platform",
    "Neural Network",
    "AI-Powered",
    "Beyond Resumes",
  ],
  authors: [{ name: "NeuralHire AI" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "NeuralHire AI — Beyond Resumes",
    description: "AI-Powered Human Intelligence Platform",
    url: "https://neuralhire.ai",
    siteName: "NeuralHire AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralHire AI — Beyond Resumes",
    description: "AI-Powered Human Intelligence Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
