import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/layout/Navigation";
import { AuthProvider } from "@/utils/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TextifyAI - AI-Powered Writing Assistant",
  description:
    "Transform your writing with TextifyAI. Advanced AI-powered writing assistance for content creators, students, and professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " text-gray-900 bg-white"}>
        <AuthProvider>
          <Navigation/>
        <div className="pt-18 bg-white">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
