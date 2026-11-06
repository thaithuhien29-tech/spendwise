"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email validation helper
  const validateEmail = (val: string): string => {
    if (!val || val.trim() === "") {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation helper
  const validatePassword = (val: string): string => {
    if (!val) {
      return "Password is required";
    }
    return "";
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (hasSubmitted) {
      setErrorEmail(validateEmail(val));
    }
    if (errorAuth) setErrorAuth("");
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (hasSubmitted) {
      setErrorPassword(validatePassword(val));
    }
    if (errorAuth) setErrorAuth("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorAuth("");

    const errEmail = validateEmail(email);
    const errPassword = validatePassword(password);

    setErrorEmail(errEmail);
    setErrorPassword(errPassword);

    if (errEmail || errPassword) {
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/books");
      } else {
        setErrorAuth(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      setErrorAuth(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
            <BookOpen className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to ShelfLife</CardTitle>
          <CardDescription>
            Enter your email and password to access your bookshelf
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate data-testid="login-form">
          <CardContent className="space-y-4">
            {/* Supabase Auth Error */}
            {errorAuth && (
              <div 
                data-testid="error-auth"
                className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
              >
                {errorAuth}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                data-testid="login-email"
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              {errorEmail && (
                <div data-testid="error-email" className="text-xs text-red-600 font-medium">
                  {errorEmail}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                data-testid="login-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {errorPassword && (
                <div data-testid="error-password" className="text-xs text-red-600 font-medium">
                  {errorPassword}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              data-testid="login-submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-sm text-center text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
