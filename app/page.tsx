"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, TrendingUp, Search, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 
          data-testid="home-title" 
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
        >
          ShelfLife
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Keep track of the books you want to read, are currently reading, and have finished. Organize your personal bookshelf and see your reading progress at a glance.
        </p>

        {isAuthenticated ? (
          <Link href="/books">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 shadow-sm">
              Go to Your Bookshelf <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-6">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Feature Cards (At least three feature cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Add books</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Easily catalog new books with title, author, total pages, and initial reading status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">
              Validated fields ensure your reading catalog stays clean and accurate.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Track your progress</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Advance your reading journey step by step from To Read, to Reading, to Finished.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">
              Real-time summary with page counters and category breakdown.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Search your shelf</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Filter by reading status and search instantly by book title or author name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">
              Instant multi-filter combination updates your view with zero delay.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
