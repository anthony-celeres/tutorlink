"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Suppress footer on chat views, login, and signup pages
  if (
    pathname === "/chat" ||
    pathname.startsWith("/chat/") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm text-slate-600 dark:text-slate-400 pb-20 md:pb-5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>© {new Date().getFullYear()} TutorLink Prototype</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
            Powered by NIMBUS
          </span>
        </div>
      </div>
    </footer>
  );
};
