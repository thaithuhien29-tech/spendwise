import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ShelfLife",
  description: "ShelfLife - Keep track of the books you want to read, are reading or have finished",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t bg-white py-4 text-center text-xs text-slate-500">
            ShelfLife © {new Date().getFullYear()} - FER202 Practical Exam
          </footer>
        </Providers>
      </body>
    </html>
  );
}
