"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { calculateMatchScore } from "@/lib/matchingAlgorithm";
import {
  Star,
  Clock,
  MapPin,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Target,
  Coins,
} from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const { tutors, searchFilter, openBookingModal } = useApp();

  const querySubject = searchParams.get("subject") || searchFilter.subject || "Microeconomics";
  const queryTopic = searchParams.get("topic") || searchFilter.topic || "";
  const queryBudget = Number(searchParams.get("budget")) || searchFilter.maxBudget || 250;

  // Calculate match scores and sort by highest score
  const matchedTutors = useMemo(() => {
    const scored = tutors.map((tutor) => {
      const matchScore = calculateMatchScore(tutor, {
        ...searchFilter,
        subject: querySubject,
        topic: queryTopic,
        maxBudget: queryBudget,
      });
      return {
        ...tutor,
        matchScore,
      };
    });

    return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [tutors, searchFilter, querySubject, queryTopic, queryBudget]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Top Breadcrumb & Modify Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <Link
            href="/find-tutor"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy-700 dark:hover:text-brand-teal-400 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Search Filters</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Matching Tutor Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sorted by highest academic match score for &ldquo;<strong>{querySubject}</strong>&rdquo;
            {queryTopic ? ` (${queryTopic})` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-navy-50 text-brand-navy-700 dark:bg-slate-800 dark:text-brand-teal-300 border border-brand-navy-200 dark:border-slate-700">
            {matchedTutors.length} Qualified Mentors Found
          </span>
        </div>
      </div>

      {/* Tutor Cards List (matching section 4 specification wireframe) */}
      <div className="space-y-4">
        {matchedTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-teal-500/50 space-y-4"
          >
            {/* Header: Photo + Name + Course/Year */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-slate-100 dark:border-slate-800">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                  {tutor.verified && (
                    <div
                      className="absolute bottom-1 right-1 bg-emerald-500 text-white p-0.5 rounded-lg"
                      title="VSU Verified Student"
                    >
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {tutor.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {tutor.degree} – {tutor.yearLevel}
                  </p>
                </div>
              </div>

              {/* Match Score & Rating Badges */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-xs">
                  <Target className="w-3.5 h-3.5" />
                  <span>{tutor.matchScore}% Match Score</span>
                </span>
              </div>
            </div>

            {/* Spec Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-4 border-y border-slate-100 dark:border-slate-800/80 text-sm sm:text-base">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-amber-500 font-bold flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{tutor.rating.toFixed(1)} / 5.0</span>
                </span>
                <span className="text-slate-400 font-normal">({tutor.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Coins className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
                <span className="font-extrabold text-slate-900 dark:text-white">
                  ₱{tutor.hourlyRate} / hour
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
                <span className="truncate">
                  <strong>{tutor.primarySubject}</strong>, {tutor.subjectsMastered.filter(s => s !== tutor.primarySubject).slice(0, 2).join(", ")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
                <span>
                  Available: {tutor.availabilityDays.slice(0, 3).join(", ")} • 4:00 PM – 7:00 PM
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
                <MapPin className="w-4 h-4 text-brand-teal-500 flex-shrink-0" />
                <span>
                  VSU Campus ({tutor.campusLocations[0]?.split("(")[0].trim() || "Library"}) / Online
                </span>
              </div>
            </div>

            {/* Action Buttons: [View Full Profile] and [Book a Session] */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-1">
              <Link
                href={`/tutors/${tutor.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-colors"
              >
                View Full Profile
              </Link>

              <button
                onClick={() => openBookingModal(tutor)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs text-center transition-all active:scale-95"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-brand-teal-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
