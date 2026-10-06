"use client";

import React, { use, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle,
  Video,
  Check,
} from "lucide-react";

function TutorDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const { getTutorById, openBookingModal, isAuthenticated } = useApp();

  const tutor = getTutorById(resolvedParams.id);
  const shouldAutoBook = searchParams.get("book") === "true";

  useEffect(() => {
    if (shouldAutoBook && tutor && isAuthenticated) {
      openBookingModal(tutor);
    }
  }, [shouldAutoBook, tutor, isAuthenticated, openBookingModal]);

  if (!tutor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Tutor Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The tutor you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/results"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tutors Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-navy-700 dark:hover:text-brand-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matching Tutors</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-4 border-white dark:border-slate-800 shadow-md">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
              {tutor.verified && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-xl shadow-sm"
                  title="VSU Verified Peer Mentor"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {tutor.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> VSU Verified
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {tutor.degree} •{" "}
                <span className="text-brand-navy-600 dark:text-brand-teal-400">
                  {tutor.yearLevel}
                </span>
              </p>
              <p className="text-xs text-slate-400">{tutor.department}</p>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{tutor.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({tutor.reviewCount} student reviews)
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  VSU ID: <span className="font-mono font-medium">{tutor.vsuId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center sm:text-right space-y-2 flex-shrink-0">
            <div>
              <span className="text-xs text-slate-400 block">Hourly Rate</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ₱{tutor.hourlyRate}
              </span>
              <span className="text-xs text-slate-500"> / hour</span>
            </div>
            <button
              onClick={() => openBookingModal(tutor)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs transition-all active:scale-95"
            >
              Book Session Now
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Bio, Subjects, Credentials, Reviews */}
        <div className="md:col-span-2 space-y-6">
          {/* About Me */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-teal-500" />
              <span>About the Mentor</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tutor.bio}
            </p>
          </div>

          {/* Subjects Mastered */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-teal-500" />
              <span>Subjects Mastered</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {tutor.subjectsMastered.map((subject, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    subject === tutor.primarySubject
                      ? "bg-brand-navy-50 text-brand-navy-800 border border-brand-navy-200 dark:bg-brand-navy-950/80 dark:text-brand-teal-300 dark:border-brand-navy-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {subject === tutor.primarySubject && (
                    <BookOpen className="w-3.5 h-3.5 text-brand-teal-500" />
                  )}
                  <span>{subject === tutor.primarySubject ? `${subject} (Primary)` : subject}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Academic Qualifications & Experience */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-teal-500" />
              <span>Academic Credentials & Achievements</span>
            </h2>
            <ul className="space-y-2">
              {tutor.qualifications.map((q, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tutoring Experience
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {tutor.tutoringExperience}
              </p>
            </div>
          </div>

          {/* Student Reviews */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Student Reviews ({tutor.reviews.length})</span>
              </h2>
              <span className="text-xs font-bold text-amber-500">
                ⭐ {tutor.rating.toFixed(1)} / 5.0
              </span>
            </div>

            {tutor.reviews.length > 0 ? (
              <div className="space-y-3">
                {tutor.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                        <span className="text-xs text-slate-400">• {rev.course}</span>
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet for this tutor.</p>
            )}
          </div>
        </div>

        {/* Right Col: Logistics, Schedule Matrix, Locations */}
        <div className="space-y-6">
          {/* Service Logistics Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tutoring Logistics
            </h3>

            {/* Delivery Modes */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Delivery Modes:</span>
              <div className="flex flex-wrap gap-1.5">
                {tutor.deliveryModes.map((mode) => (
                  <span
                    key={mode}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {mode === "Online" ? (
                      <Video className="w-3.5 h-3.5 text-brand-teal-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-brand-teal-500" />
                    )}
                    <span>{mode === "Online" ? "Google Meet" : "VSU Campus"}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Campus Locations */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400">VSU Study Meetup Spots:</span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {tutor.campusLocations.map((loc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal-500 mt-0.5 flex-shrink-0" />
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability Days */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Weekly Available Days:</span>
              <div className="flex flex-wrap gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                  const isAvailable = tutor.availabilityDays.includes(d);
                  return (
                    <span
                      key={d}
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isAvailable
                          ? "bg-brand-teal-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {d[0]}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Available Timeslots */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Timeslots:</span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {tutor.timeslots.map((slot, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                    <span>{slot}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Styles Accommodated */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Learning Styles:</span>
              <div className="flex flex-wrap gap-1.5">
                {tutor.learningStyles.map((style) => (
                  <span
                    key={style}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-navy-50 text-brand-navy-700 dark:bg-brand-navy-950 dark:text-brand-teal-300"
                  >
                    <Check className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span>{style}</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => openBookingModal(tutor)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs transition-all mt-4 active:scale-95"
            >
              Select Slot & Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-slate-400">
          Loading tutor profile...
        </div>
      }
    >
      <TutorDetailContent params={params} />
    </Suspense>
  );
}
