"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, BookOpen } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

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
    if (val.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Confirm password validation helper
  const validateConfirmPassword = (val: string, currentPassword: string): string => {
    if (!val) {
      return "Confirm password is required";
    }
    if (val !== currentPassword) {
      return "Passwords do not match";
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
      if (confirmPassword) {
        setErrorConfirmPassword(validateConfirmPassword(confirmPassword, val));
      }
    }
    if (errorAuth) setErrorAuth("");
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (hasSubmitted) {
      setErrorConfirmPassword(validateConfirmPassword(val, password));
    }
    if (errorAuth) setErrorAuth("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorAuth("");
    setFormSuccess("");

    const errEmail = validateEmail(email);
    const errPassword = validatePassword(password);
    const errConfirm = validateConfirmPassword(confirmPassword, password);

    setErrorEmail(errEmail);
    setErrorPassword(errPassword);
    setErrorConfirmPassword(errConfirm);

    if (errEmail || errPassword || errConfirm) {
      return;
    }

    setLoading(true);
    try {
      const res = await register(email, password);
      if (res.success) {
        setFormSuccess("Registration successful");
        // Clear form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setHasSubmitted(false);
      } else {
        setErrorAuth(res.message || "Registration failed");
      }
    } catch (err: any) {
      setErrorAuth(err.message || "An unexpected error occurred during registration");
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
          <CardTitle className="text-2xl font-bold">Create ShelfLife Account</CardTitle>
          <CardDescription>
            Register with your email to start your reading journey
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate data-testid="register-form">
          <CardContent className="space-y-4">
            {/* Success Notification */}
            {formSuccess && (
              <div 
                data-testid="form-success"
                className="p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md font-medium"
              >
                {formSuccess}
              </div>
            )}

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
                data-testid="register-email"
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
                data-testid="register-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {errorPassword && (
                <div data-testid="error-password" className="text-xs text-red-600 font-medium">
                  {errorPassword}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Confirm Password</label>
              <Input
                type="password"
                data-testid="register-confirm-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              />
              {errorConfirmPassword && (
                <div data-testid="error-confirm-password" className="text-xs text-red-600 font-medium">
                  {errorConfirmPassword}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              data-testid="register-submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            <div className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
