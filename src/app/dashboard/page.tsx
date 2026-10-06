"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  MapPin,
  Search,
} from "lucide-react";

export default function ProfilePage() {
  const { role, currentUser, bookings, updateBookingStatus } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-brand-teal-500/30 flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3" /> VSU Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentUser.email} • {currentUser.vsuId || "VSU Student"}
            </p>
            <div className="pt-1">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-navy-50 text-brand-navy-700 dark:bg-slate-800 dark:text-brand-teal-400">
                Role: {role === "tutor" ? "Peer Mentor" : "Student (Mentee)"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        {role === "mentee" ? (
          <Link
            href="/find-tutor"
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-navy-700 to-brand-teal-500 hover:from-brand-navy-800 text-white transition-all shadow-xs text-center inline-flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find a Tutor</span>
          </Link>
        ) : (
          <Link
            href="/become-a-tutor"
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs text-center inline-flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-teal-500" />
            <span>Tutor Profile</span>
          </Link>
        )}
      </div>

      {/* Navigation Pill */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-teal-500" />
          <span>My Matched Study Sessions ({bookings.length})</span>
        </h2>
        <Link
          href="/results"
          className="text-xs sm:text-sm font-bold text-brand-navy-700 dark:text-brand-teal-400 hover:underline flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore All Tutors</span>
        </Link>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">You haven&apos;t matched with any tutors yet.</p>
            <Link
              href="/find-tutor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-navy-700 to-brand-teal-500 shadow-sm"
            >
              <span>Find a Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
                  <img src={b.tutorAvatar} alt={b.tutorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {b.tutorName}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span>{b.subject} • ₱{b.totalAmount}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal-500" />
                      <span>{b.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal-500" />
                      <span>{b.locationDetail}</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {b.status === "Pending" && (
                  <button
                    onClick={() => updateBookingStatus(b.id, "Confirmed")}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                  >
                    Confirm
                  </button>
                )}
                <Link
                  href={`/chat?id=${b.id}`}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-navy-700 hover:bg-brand-navy-800 flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
