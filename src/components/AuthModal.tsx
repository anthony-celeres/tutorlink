"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
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

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    authModalMessage,
    login,
    signup,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupVsuId, setSignupVsuId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("mentee");
  const [signupDepartment, setSignupDepartment] = useState("Faculty of Engineering");
  const [signupError, setSignupError] = useState<string | null>(null);

  // Sync modal mode from context
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
      setLoginError(null);
      setSignupError(null);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError("Please enter your VSU institutional email or student ID.");
      return;
    }

    login(loginIdentifier.trim(), loginPassword);
  };

  const handleDemoLogin = (asRole: "mentee" | "tutor") => {
    setLoginError(null);
    if (asRole === "tutor") {
      login("maria.santos@vsu.edu.ph", "password123", "tutor");
    } else {
      login("angelo.reyes@vsu.edu.ph", "password123", "mentee");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName.trim()) {
      setSignupError("Please enter your full name.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setSignupError("Please provide a valid VSU institutional email (@vsu.edu.ph).");
      return;
    }

    signup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      vsuId: signupVsuId.trim() || "23-1-0492",
      role: signupRole,
      department: signupDepartment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto">
        {/* Subtle Brand Accent Line */}
        <div className="h-1 bg-gradient-to-r from-brand-navy-700 via-brand-teal-500 to-emerald-500 w-full" />

        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-white dark:bg-slate-800/90 p-1.5 shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
              <Image
                src="/tutorlink_logo.png"
                alt="TutorLink Emblem"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  TutorLink
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Peer-to-Peer Academic Mentoring Network
              </p>
            </div>
          </div>

          {/* Contextual Notice Banner */}
          {authModalMessage && (
            <div className="mt-3.5 p-3 rounded-2xl bg-brand-navy-50/80 dark:bg-slate-800/80 border border-brand-teal-500/30 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-teal-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-brand-navy-900 dark:text-brand-teal-200 leading-relaxed">
                {authModalMessage}
              </p>
            </div>
          )}

          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 mt-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError(null);
              }}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-white dark:bg-slate-900 text-brand-navy-700 dark:text-brand-teal-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setSignupError(null);
              }}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "signup"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: LOGIN */}
          {activeTab === "login" && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    VSU Email or Student ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. angelo.reyes@vsu.edu.ph or 22-1-0492"
                      className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-brand-teal-600 dark:text-brand-teal-400 font-semibold cursor-pointer hover:underline">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your student portal password"
                      className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 pl-10 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs transition-all active:scale-[0.98] cursor-pointer mt-1"
                >
                  Log In to TutorLink
                </button>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signup");
                        setLoginError(null);
                      }}
                      className="font-bold text-brand-teal-600 dark:text-brand-teal-400 hover:underline cursor-pointer"
                    >
                      Create Student Account
                    </button>
                  </p>
                </div>
              </form>

              {/* 1-Click Demo Profiles */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-center">
                  Quick 1-Click Demo Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("mentee")}
                    className="py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/50 hover:border-brand-teal-500/60 hover:bg-brand-teal-50/40 dark:hover:bg-brand-teal-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Mentee Demo
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("tutor")}
                    className="py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/50 hover:border-brand-teal-500/60 hover:bg-brand-teal-50/40 dark:hover:bg-brand-teal-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-2xs"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Tutor Demo
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {signupError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                  {signupError}
                </div>
              )}

              {/* Primary Role Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  I want to join TutorLink primarily to:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole("mentee")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === "mentee"
                        ? "border-2 border-brand-teal-500 bg-brand-teal-50/70 dark:bg-brand-teal-950/40 text-brand-teal-950 dark:text-brand-teal-200 ring-1 ring-brand-teal-500/20 shadow-xs"
                        : "border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        signupRole === "mentee"
                          ? "bg-brand-teal-500 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate flex-1">
                      Find a Tutor
                    </span>
                    {signupRole === "mentee" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600 dark:text-brand-teal-400 flex-shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole("tutor")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      signupRole === "tutor"
                        ? "border-2 border-brand-teal-500 bg-brand-teal-50/70 dark:bg-brand-teal-950/40 text-brand-teal-950 dark:text-brand-teal-200 ring-1 ring-brand-teal-500/20 shadow-xs"
                        : "border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        signupRole === "tutor"
                          ? "bg-brand-teal-500 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate flex-1">
                      Become Tutor
                    </span>
                    {signupRole === "tutor" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600 dark:text-brand-teal-400 flex-shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Angelo Reyes"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Email & Student ID Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    VSU Institutional Email
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="student.name@vsu.edu.ph"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    VSU Student ID
                  </label>
                  <input
                    type="text"
                    value={signupVsuId}
                    onChange={(e) => setSignupVsuId(e.target.value)}
                    placeholder="e.g. 23-1-0812"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                  />
                </div>
              </div>

              {/* Faculty / Academic Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Faculty / Academic Department
                </label>
                <div className="relative">
                  <select
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    className="w-full appearance-none bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal cursor-pointer"
                  >
                    {VSU_FACULTIES.map((faculty) => (
                      <option key={faculty} value={faculty} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                        {faculty}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a secure student password"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all leading-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                By creating an account, you agree to the VISCAN Honor Code and Safe Tutoring Guidelines.
              </p>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                Create Account & Continue
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have a student account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setSignupError(null);
                    }}
                    className="font-bold text-brand-navy-700 dark:text-brand-teal-400 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
