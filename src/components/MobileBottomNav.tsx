"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, GraduationCap, Calendar, MessageSquare } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useApp();

  if (pathname === "/login" || pathname === "/signup") return null;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Find Tutor", href: "/find-tutor", icon: Search },
    { label: "Teach", href: "/become-a-tutor", icon: GraduationCap },
    ...(isAuthenticated ? [
      { label: "Sessions", href: "/dashboard", icon: Calendar },
      { label: "Messages", href: "/chat", icon: MessageSquare },
    ] : []),
  ];

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {items.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
            className={"flex-1 min-w-0 flex flex-col items-center gap-1 py-3 text-[11px] sm:text-xs " + (pathname === href ? "font-semibold text-brand-navy-700 dark:text-brand-teal-300" : "text-slate-600 dark:text-slate-300")}>
            <Icon className="w-5 h-5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
