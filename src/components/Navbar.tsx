"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Sun,
  Moon,
  Search,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    role,
    bookings,
    currentUser,
    isAuthenticated,
    logout,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // Auto-close menus on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Hide the global navbar header completely on dedicated login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const navLinks = [
    { label: "Find a Tutor", href: "/find-tutor" },
    { label: "Become a Tutor", href: "/become-a-tutor" },
    ...(isAuthenticated
      ? [
          { label: "Dashboard", href: "/dashboard" },
          {
            label: "Messages",
            href: "/chat",
            badge: pendingCount > 0 ? pendingCount : undefined,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-[#0c1322]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group select-none active:scale-98 transition-transform"
            aria-label="TutorLink Homepage"
          >
            {/* VSU Mascot / TutorLink Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-brand-navy-50 to-brand-teal-50 dark:from-slate-800 dark:to-slate-800 p-1 flex items-center justify-center shadow-xs border border-slate-200/70 dark:border-slate-700/80 group-hover:border-brand-teal-500 transition-colors flex-shrink-0">
              <Image
                src="/tutorlink_logo.png"
                alt="TutorLink Emblem"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>

            {/* Wordmark */}
            <div className="relative h-6 sm:h-7 w-24 sm:w-32 flex-shrink-0">
              <Image
                src="/tutorlink_textlogo.png"
                alt="TutorLink Wordmark"
                fill
                className="object-contain object-left dark:brightness-110"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-brand-navy-900 dark:text-brand-teal-300 bg-slate-100/90 dark:bg-slate-800 shadow-2xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:text-brand-teal-500 dark:hover:text-brand-teal-400 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              <span className="sr-only">Toggle Light / Dark Theme</span>
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Desktop Divider */}
                <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

                {/* Log In Button Only */}
                <Link
                  href="/login"
                  className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  Log In
                </Link>
              </div>
            ) : (
              /* User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-2 py-1 px-1.5 sm:pr-3 rounded-full border transition-all text-xs font-semibold shadow-xs select-none active:scale-95 cursor-pointer ${
                    profileDropdownOpen
                      ? "border-brand-teal-500 bg-brand-teal-50/80 dark:bg-brand-teal-950/50 text-brand-navy-900 dark:text-brand-teal-200 ring-2 ring-brand-teal-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:inline max-w-[120px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180 text-brand-teal-500" : ""
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    {/* User Summary Header */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 mb-2">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {currentUser.name}
                          </p>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-navy-100 text-brand-navy-800 dark:bg-brand-navy-950 dark:text-brand-teal-300">
                            {currentUser.vsuId || "VSU Student"}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {role === "tutor" ? "Peer Mentor" : "Mentee"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-brand-navy-600 dark:text-brand-teal-400" />
                          <span>My Dashboard & Sessions</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {bookings.length}
                        </span>
                      </Link>

                      <Link
                        href="/chat"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-brand-teal-500" />
                          <span>Messages & Live Chat</span>
                        </div>
                        {pendingCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                            {pendingCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/find-tutor"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <Search className="w-4 h-4 text-brand-teal-500" />
                        <span>Find a Peer Tutor</span>
                      </Link>

                      <Link
                        href="/become-a-tutor"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-brand-teal-500" />
                        <span>Become a Peer Mentor</span>
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold transition-colors mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
