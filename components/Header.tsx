"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand / App Name */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 font-bold text-xl text-slate-900 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="tracking-tight font-extrabold text-slate-900">ShelfLife</span>
        </Link>

        {/* Right Section: Auth buttons / User Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/books" 
                data-testid="link-books"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Books
              </Link>
              <span 
                data-testid="user-email"
                className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200"
              >
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={() => logout()}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-9 px-3 text-xs"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid="btn-login"
                  className="text-sm font-medium"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  size="sm" 
                  data-testid="btn-register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
