"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { BooksProvider } from "@/contexts/BooksContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BooksProvider>{children}</BooksProvider>
    </AuthProvider>
  );
}
