"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, GraduationCap, MessageSquare } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { bookings, isAuthenticated } = useApp();
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Find Tutor", href: "/find-tutor", icon: Search },
    { label: "Teach", href: "/become-a-tutor", icon: GraduationCap },
    {
      label: "Sessions",
      href: "/chat",
      icon: MessageSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 safe-bottom shadow-xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (!isAuthenticated && item.href === "/chat") {
                  e.preventDefault();
                  router.push("/login?redirect=/chat");
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive
                  ? "text-brand-navy-700 dark:text-brand-teal-400 font-bold"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5.5 h-5.5 transition-transform ${
                    isActive ? "scale-105 text-brand-teal-500" : ""
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-1 font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
