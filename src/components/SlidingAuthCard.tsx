"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  User,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const VSU_FACULTIES = [
  "Faculty of Engineering",
  "Faculty of Teacher Education",
  "Faculty of Arts and Sciences",
  "Faculty of Management and Economics",
  "Faculty of Agriculture and Food Science",
  "Faculty of Nursing",
  "Faculty of Veterinary Medicine",
  "Faculty of Forestry and Environmental Science",
];

interface FormProps {
  redirectPath: string;
  isMobile?: boolean;
}

function LoginFormContent({ redirectPath, isMobile = false }: FormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingTutor = searchParams.get("tutor");
  const { login, isAuthenticated } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please enter your VSU institutional email or student ID.");
      return;
    }

    setIsLoading(true);
    const success = login(identifier.trim(), password);
    if (success) {
      router.push(redirectPath);
    } else {
      setIsLoading(false);
      setError("Invalid credentials. Please try again or use a demo account.");
    }
  };

  const handleDemoLogin = (role: "mentee" | "tutor") => {
    setError(null);
    setIsLoading(true);
    if (role === "tutor") {
      login("maria.santos@vsu.edu.ph", "password123", "tutor");
    } else {
      login("angelo.reyes@vsu.edu.ph", "password123", "mentee");
    }
    router.push(redirectPath);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isMobile ? "space-y-4" : "space-y-5"}`}>
      {/* Top back navigation (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy-700 dark:text-slate-400 dark:hover:text-brand-teal-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}

      {/* Desktop Heading (Mobile has it in the colored header) */}
      {!isMobile && (
        <div className="space-y-1.5 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to coordinate tutoring sessions, message mentors, and track study progress.
          </p>
        </div>
      )}

      {bookingTutor && (
        <div className="p-3 rounded-xl bg-brand-navy-50 dark:bg-brand-navy-950/60 border border-brand-navy-200 dark:border-brand-navy-800 text-xs text-brand-navy-900 dark:text-brand-teal-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
          <span className="leading-snug">
            Log in to confirm your session booking with <strong>{bookingTutor}</strong>.
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            VSU Email or Student ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. angelo.reyes@vsu.edu.ph or 22-1-0492"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all shadow-xs"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <span className="text-[11px] text-brand-teal-600 dark:text-brand-teal-400 font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your student portal password"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all shadow-xs"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm sm:text-base text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-75"
        >
          <span>{isLoading ? "Signing In..." : "Log In to TutorLink"}</span>
        </button>
      </form>

      {/* 1-Click Demo Profiles (Back below the login button) */}
      <div className="pt-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Quick 1-Click Demo Access
          </span>
          <span className="text-[10px] font-semibold text-brand-teal-600 dark:text-brand-teal-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Instant Test</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("mentee")}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-teal-500/60 hover:bg-brand-teal-50/30 dark:hover:bg-brand-teal-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-2xs active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Mentee Demo
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("tutor")}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-teal-500/60 hover:bg-brand-teal-50/30 dark:hover:bg-brand-teal-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-2xs active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Tutor Demo
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SignupFormContent({ redirectPath, isMobile = false }: FormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingTutor = searchParams.get("tutor");
  const { signup, isAuthenticated } = useApp();

  const [role] = useState<UserRole>("mentee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vsuId, setVsuId] = useState("");
  const [department, setDepartment] = useState("Faculty of Engineering");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid VSU institutional email (@vsu.edu.ph).");
      return;
    }

    setIsLoading(true);
    signup({
      name: name.trim(),
      email: email.trim(),
      password,
      vsuId: vsuId.trim() || "23-1-0492",
      role,
      department,
    });
    router.push(redirectPath);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isMobile ? "space-y-3.5" : "space-y-4"}`}>
      {/* Top back navigation (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}

      {/* Desktop Heading (Mobile has it in the colored header) */}
      {!isMobile && (
        <div className="space-y-1 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join the VISCAN peer tutoring network in less than a minute.
          </p>
        </div>
      )}

      {/* Booking Context Banner / Student Note */}
      {bookingTutor ? (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="leading-snug">
            Sign up to complete your session booking with <strong>{bookingTutor}</strong>.
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            Student Account for booking peer tutors across VSU campus.
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Angelo Reyes"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Email & Student ID Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              VSU Institutional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@vsu.edu.ph"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              VSU Student ID
            </label>
            <input
              type="text"
              value={vsuId}
              onChange={(e) => setVsuId(e.target.value)}
              placeholder="e.g. 23-1-0812"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Faculty / Academic Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Faculty / Academic Department
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs cursor-pointer"
            >
              {VSU_FACULTIES.map((faculty) => (
                <option key={faculty} value={faculty} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {faculty}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create secure student password"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-75"
        >
          <span>{isLoading ? "Creating Account..." : "Create Account & Continue"}</span>
        </button>
      </form>

      <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
        Looking to become a peer mentor instead?{" "}
        <Link href="/become-a-tutor" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
          Apply to Become a Tutor →
        </Link>
      </p>
    </div>
  );
}

export function SlidingAuthCard({ initialMode }: { initialMode: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/dashboard";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Sync state if prop changes (e.g. from client router transitions)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/signup") {
        setMode("signup");
      } else if (path === "/login") {
        setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleModeChange = (newMode: "login" | "signup") => {
    setMode(newMode);
    const queryString = redirectParam !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectParam)}` : "";
    const newUrl = `/${newMode}${queryString}`;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div>
      {/* ======================================================== */}
      {/* DESKTOP VIEW (lg:flex): Sliding Two-Panel Card           */}
      {/* ======================================================== */}
      <div className="hidden lg:flex min-h-screen items-center justify-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative flex w-full max-w-5xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden h-[630px]">
          {/* LEFT SLOT: Signup Form (Active when in signup mode) */}
          <div
            className={`w-1/2 flex-shrink-0 h-full p-8 lg:p-9 flex flex-col justify-center overflow-y-auto bg-slate-50/50 dark:bg-slate-900/60 transition-all duration-700 ease-in-out ${
              mode === "signup"
                ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                : "opacity-0 -translate-x-8 pointer-events-none z-0"
            }`}
          >
            <SignupFormContent redirectPath={redirectParam} />
          </div>

          {/* RIGHT SLOT: Login Form (Active when in login mode) */}
          <div
            className={`w-1/2 flex-shrink-0 h-full p-8 lg:p-9 flex flex-col justify-center overflow-y-auto bg-slate-50/50 dark:bg-slate-900/60 transition-all duration-700 ease-in-out ${
              mode === "login"
                ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                : "opacity-0 translate-x-8 pointer-events-none z-0"
            }`}
          >
            <LoginFormContent redirectPath={redirectParam} />
          </div>

          {/* SLIDING COLORED OVERLAY PANEL (DESKTOP) */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 z-20 transition-transform duration-700 ease-in-out shadow-2xl ${
              mode === "login" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* BLUE GRADIENT LAYER (Login Brand Showcase) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-brand-navy-900 via-brand-navy-800 to-[#081a36] text-white p-8 lg:p-10 flex flex-col justify-between transition-opacity duration-700 ease-in-out border-r border-white/10 ${
                mode === "login" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brand-teal-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-brand-navy-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-md p-1.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src="/tutorlink_logo.png"
                      alt="TutorLink Emblem"
                      width={34}
                      height={34}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">
                    TutorLink
                  </span>
                </Link>

                <div className="space-y-2 pt-1">
                  <h2 className="text-2xl font-black leading-tight text-white">
                    Learn with confidence across the VISCAN community.
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Connect with vetted high-performing peer mentors for exam preparation, problem sets, and academic guidance.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Verified Peer Tutors across all Faculties</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-full bg-brand-teal-500/20 text-brand-teal-300 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Safe VSU Campus Meetup Hubs & Virtual Rooms</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-full bg-brand-navy-400/20 text-blue-300 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Private Built-in Chat & Session Scheduling</span>
                  </div>
                </div>
              </div>

              {/* ACTION: Switch to Signup inside Colored Blue Area */}
              <div className="relative z-10 pt-4 border-t border-white/15">
                <p className="text-xs text-blue-100 font-medium mb-2.5">
                  Don&apos;t have a student account yet?
                </p>
                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-brand-navy-900 font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <span>Create a Student Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* GREEN GRADIENT LAYER (Signup Brand Showcase) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white p-8 lg:p-10 flex flex-col justify-between transition-opacity duration-700 ease-in-out border-l border-emerald-500/20 ${
                mode === "signup" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-400/25 blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-teal-400/25 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <div className="w-11 h-11 rounded-2xl bg-white shadow-md p-1.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src="/tutorlink_logo.png"
                      alt="TutorLink Emblem"
                      width={34}
                      height={34}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">
                    TutorLink
                  </span>
                </Link>

                <div className="space-y-2 pt-1">
                  <h2 className="text-2xl font-black leading-tight text-white">
                    Start your peer tutoring journey at VSU today.
                  </h2>
                  <p className="text-xs text-emerald-100 leading-relaxed font-normal">
                    Join hundreds of Viscans connecting every week for mutual academic excellence, collaborative problem-solving, and subject mastery.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-3 text-xs text-emerald-50">
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Free Student Account with VSU Email</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-emerald-50">
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Transparent Hourly Honorarium for Mentors</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-emerald-50">
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Comprehensive Faculty Course Alignment</span>
                  </div>
                </div>
              </div>

              {/* ACTION: Switch to Login inside Colored Green Area */}
              <div className="relative z-10 pt-4 border-t border-emerald-500/30">
                <p className="text-xs text-emerald-100 font-medium mb-2.5">
                  Already have a student account?
                </p>
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-emerald-900 font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Log In to Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIRECTION A: MOBILE FULL-BLEED NATIVE LAYOUT (< lg)     */}
      {/* Clean, compact, app-like, edge-to-edge experience        */}
      {/* ======================================================== */}
      <div className="lg:hidden w-full flex flex-col px-4 pt-3 pb-3 sm:px-6 max-w-md mx-auto -mb-20 md:mb-0 transition-colors">
        {/* Mobile Top Brand Bar */}
        <div className="flex items-center justify-between pt-1 pb-3">
          <Link href="/" className="inline-flex items-center gap-2 group select-none">
            <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/90 dark:border-slate-700/80 p-1 flex items-center justify-center flex-shrink-0">
              <Image
                src="/tutorlink_logo.png"
                alt="TutorLink Emblem"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              TutorLink
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Dynamic Context Header */}
        <div className="mb-3.5 space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === "login" ? "Welcome back" : "Create Student Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Sign in to coordinate tutoring sessions and message mentors."
              : "Join the peer tutoring network in less than a minute."}
          </p>
        </div>

        {/* Tactile Segmented Pill Switcher with Clean White Active State */}
        <div className="p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-1 mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              mode === "login"
                ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Lock className={`w-3.5 h-3.5 ${mode === "login" ? "text-brand-navy-700 dark:text-brand-teal-400" : ""}`} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("signup")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              mode === "signup"
                ? "bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className={`w-3.5 h-3.5 ${mode === "signup" ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Mobile Horizontal Sliding Forms Track (Naturally fitted height) */}
        <div className="overflow-hidden w-full relative">
          <div
            className={`w-[200%] flex items-start transition-transform duration-400 ease-out will-change-transform ${
              mode === "login" ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            {/* Slide 1: Login Form (100% of mobile screen width) */}
            <div className="w-1/2 pr-2 flex flex-col">
              <LoginFormContent redirectPath={redirectParam} isMobile />
            </div>

            {/* Slide 2: Signup Form (100% of mobile screen width) */}
            <div className="w-1/2 pl-2 flex flex-col">
              <SignupFormContent redirectPath={redirectParam} isMobile />
            </div>
          </div>
        </div>

        {/* Attribution at the bottom */}
        <div className="pt-3 pb-2 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
            Powered by NIMBUS
          </p>
        </div>
      </div>
    </div>
  );
}
