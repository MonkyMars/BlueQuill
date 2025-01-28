import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/layout/Navigation";
import { AuthProvider } from "@/utils/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlueQuill - AI Writing Assistant for Content Creators",
  description:
    "Transform your writing with BlueQuill, an AI-powered writing assistant for content creators, students, and professionals. Get AI-powered writing suggestions, grammar correction, and content optimization for your documents and articles.",
  keywords: [
    "writing assistant",
    "ai writing",
    "content generation",
    "language model",
    "grammar correction",
    "writing tool",
    "ai-powered writing",
    "writing app",
    "writing software",
    "content optimization",
    "ai chatbot",
    "document analysis",
    "seo analysis",
    "document optimization",
    "writing analytics",
    "content analysis",
    "ai content generation",
    "ai document generation",
    "ai writing suggestions",
    "ai document suggestions",
    "ai writing assistant",
    "ai document assistant",
    "content creator",
    "student",
    "professional",
  ],
  openGraph: {
    title: "BlueQuill - AI Writing Assistant for Content Creators",
    description:
      "Transform your writing with BlueQuill, an AI-powered writing assistant for content creators, students, and professionals. Get AI-powered writing suggestions, grammar correction, and content optimization for your documents and articles.",
    url: "https://bluequill.tech",
    siteName: "BlueQuill",
    images: [
      {
        url: "https://bluequill.tech/og.png",
        width: 1200,
        height: 630,
        alt: "BlueQuill - AI-Powered Writing Assistant for Content Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlueQuill - AI Writing Assistant for Content Creators",
    description:
      "Transform your writing with BlueQuill, an AI-powered writing assistant for content creators, students, and professionals. Get AI-powered writing suggestions, grammar correction, and content optimization for your documents and articles.",
    creator: "@bluequill_tech",
    images: [
      {
        url: "https://bluequill.tech/og.png",
        width: 1200,
        height: 630,
        alt: "BlueQuill - AI-Powered Writing Assistant for Content Creators",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 bg-white`}>
        <AuthProvider>
          <Navigation/>
        <div className="pt-18 bg-white">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
