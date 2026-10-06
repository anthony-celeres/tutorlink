"use client";

import React from "react";
import Link from "next/link";
import { Tutor } from "@/types";
import { Star, ShieldCheck, MapPin, Calendar, Sparkles, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface TutorCardProps {
  tutor: Tutor;
  matchScore?: number;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, matchScore }) => {
  const { openBookingModal } = useApp();
  const displayScore = matchScore ?? tutor.matchScore ?? 92;

  // Determine badge color based on match score
  const getBadgeStyle = (score: number) => {
    if (score >= 90) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (score >= 80) {
      return "bg-brand-navy-50 text-brand-navy-700 border-brand-navy-200 dark:bg-brand-navy-950/60 dark:text-brand-teal-300 dark:border-brand-navy-800";
    }
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-brand-teal-500/50 flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar + Info + Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-slate-100 dark:border-slate-800">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {tutor.verified && (
                <div
                  className="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-tl-lg"
                  title="Verified VSU Student ID"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/tutors/${tutor.id}`}
                  className="font-bold text-base text-slate-900 dark:text-white hover:text-brand-navy-600 dark:hover:text-brand-teal-400 transition-colors"
                >
                  {tutor.name}
                </Link>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {tutor.degree} • <span className="text-brand-navy-600 dark:text-brand-teal-400 font-semibold">{tutor.yearLevel}</span>
              </p>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tutor.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">({tutor.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Match Compatibility Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(
              displayScore
            )}`}
            title={`${displayScore}% compatibility based on your selected subject, schedule, and budget`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{displayScore}% Match</span>
          </div>
        </div>

        {/* Primary Competency & Mastered Subjects */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Primary Competency
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-navy-50 text-brand-navy-800 dark:bg-brand-navy-950/80 dark:text-brand-teal-300 border border-brand-navy-200/60 dark:border-brand-navy-800">
              <BookOpen className="w-3.5 h-3.5 text-brand-teal-500" />
              <span>{tutor.primarySubject}</span>
            </span>
            {tutor.subjectsMastered
              .filter((s) => s !== tutor.primarySubject)
              .slice(0, 2)
              .map((subject, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {subject}
                </span>
              ))}
            {tutor.subjectsMastered.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs text-slate-400">
                +{tutor.subjectsMastered.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Schedule & Location Details */}
        <div className="mt-4 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
            <span>
              Available:{" "}
              <strong className="text-slate-700 dark:text-slate-200 font-semibold">
                {tutor.availabilityDays.join(", ")}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
            <span className="truncate">
              {tutor.deliveryModes.join(" & ")} ({tutor.campusLocations[0]?.split("(")[0].trim() || "Campus"})
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Price + Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-slate-400 block -mb-0.5">Rate</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            ₱{tutor.hourlyRate}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/hr</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={() => openBookingModal(tutor)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs active:scale-95 transition-all"
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
};
