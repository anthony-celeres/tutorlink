"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useApp();

  if (pathname === "/login" || pathname === "/signup") return null;

  const links = [
    { label: "Find a Tutor", href: "/find-tutor" },
    { label: "Become a Tutor", href: "/become-a-tutor" },
    ...(isAuthenticated
      ? [{ label: "My Sessions", href: "/dashboard" }, { label: "Messages", href: "/chat" }]
      : []),
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 min-h-16 flex items-center justify-between gap-4">
        <Link href="/" aria-label="TutorLink home" className="flex items-center gap-2 shrink-0">
          <Image src="/tutorlink_logo.png" alt="" width={36} height={36} priority />
          <div className="relative h-7 w-28">
            <Image src="/tutorlink_textlogo.png" alt="TutorLink" fill className="object-contain object-left" priority />
          </div>
        </Link>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
              className={pathname === link.href
                ? "font-semibold text-brand-navy-700 dark:text-brand-teal-300"
                : "text-slate-600 dark:text-slate-300 hover:underline"}>
              {link.label}
            </Link>
          ))}
        </nav>
        {isAuthenticated ? (
          <button type="button" onClick={logout} className="shrink-0 py-2 text-sm text-slate-600 dark:text-slate-300 hover:underline">
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="shrink-0 px-4 py-2 rounded-lg bg-brand-navy-700 hover:bg-brand-navy-800 text-sm font-semibold text-white">
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};
