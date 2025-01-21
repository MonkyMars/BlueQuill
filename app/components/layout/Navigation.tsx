"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/utils/AuthProvider";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/learn-more", label: "Learn More" },
    { href: "/pricing", label: "Pricing" },
    user
      ? { href: "/settings", label: "Settings" }
      : { href: "/login", label: "Sign In" },
  ];

  return (
    <nav className="bg-gradient-to-r from-white to-gray-100 border-b border-blue-100 shadow-md relative w-full z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent 
            transition-transform group-hover:scale-105">TextifyAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative
                    hover:text-blue-600 ${
                    isActivePath(link.href) 
                      ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-full after:bg-blue-600" 
                      : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!user?.id ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/register"
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 
                  rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
                  shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/documents"
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 
                  rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
                  shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  My documents
                </Link>
              </div>
            )}
          </div>
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 ${
                    isActivePath(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-200" />
              {!user?.id ? (
                <div>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div>
                  <Link
                    href="/documents"
                    className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My documents
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
