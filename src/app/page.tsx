"use client";
import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Search,
  GraduationCap,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  BookOpen,
  Building2,
  Video,
} from "lucide-react";

export default function LandingPage() {
  const { tutors, openBookingModal } = useApp();

  const previewTutors = tutors.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline & Description */}
          <div className="max-w-2xl mx-auto space-y-3.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
              A centralized mentor–mentee matching platform designed for the{" "}
              <span className="text-brand-navy-700 dark:text-brand-teal-400">
                VISCAN
              </span>{" "}
              community.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Connect with vetted high-performing VSU peer tutors for personalized exam preparation, problem-solving mastery, and academic guidance.
            </p>
          </div>

          {/* Primary Call-to-Action (CTA) Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              href="/find-tutor"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-white bg-gradient-to-r from-brand-navy-700 to-brand-teal-500 hover:from-brand-navy-800 hover:to-brand-teal-600 shadow-md shadow-teal-500/25 transition-all flex items-center justify-center gap-3 group active:scale-98"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span>Find a Tutor</span>
            </Link>

            <Link
              href="/become-a-tutor"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-3 active:scale-98"
            >
              <GraduationCap className="w-5 h-5 text-brand-teal-500 flex-shrink-0" />
              <span>Become a Tutor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SUBJECTS AT VSU */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-1.5 mb-6">
          <span className="text-xs sm:text-sm font-bold text-brand-teal-600 dark:text-brand-teal-400 uppercase tracking-wider">
            Academic Courses
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Commonly Requested Subjects
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { code: "Microeconomics", name: "Econ & Agribusiness" },
            { code: "Math 21", name: "Differential Calculus" },
            { code: "Chem 11 / 21", name: "General & Organic Chem" },
            { code: "CMSC 21", name: "Data Structures & C" },
            { code: "Stat 1 / 101", name: "Elementary Statistics" },
            { code: "Physics 11", name: "General Mechanics" },
            { code: "Crop Sci 11", name: "Agronomy & Plant Sci" },
            { code: "Comm 10", name: "Technical Writing" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/find-tutor?course=${encodeURIComponent(item.code)}`}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-teal-500 hover:shadow-md transition-all text-center space-y-1.5 shadow-xs group"
            >
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-navy-700 dark:group-hover:text-brand-teal-400 transition-colors block">
                {item.code}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block font-medium truncate">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED TUTORS PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-brand-teal-600 dark:text-brand-teal-400 uppercase tracking-widest">
              Verified Mentors
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Featured VSU Peer Tutors
            </h2>
          </div>
          <Link
            href="/find-tutor"
            className="text-xs sm:text-sm font-bold text-brand-navy-700 dark:text-brand-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Match with a tutor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {previewTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {tutor.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {tutor.degree} – {tutor.yearLevel}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({tutor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                    <span className="font-medium truncate">{tutor.subjectsMastered.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                    <span>{tutor.availabilityDays.join(", ")} • 4:00 PM – 7:00 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                    <span className="truncate">{tutor.campusLocations[0] || "VSU Library / Online"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block -mb-0.5">Rate</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₱{tutor.hourlyRate} / hour
                  </span>
                </div>
                <button
                  onClick={() => openBookingModal(tutor)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs active:scale-95 transition-all"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VSU CAMPUS MEETUP HUBS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
              VSU Safe Study Venues
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Meet in-person at trusted campus facilities or coordinate remote study rooms on Google Meet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-teal-500" />
                <span>VSU University Library</span>
              </span>
              <p className="text-slate-500 text-xs">
                Discussion Rooms 1 & 2, 2nd Floor Study Cubicles.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal-500" />
                <span>Department Study Sheds</span>
              </span>
              <p className="text-slate-500 text-xs">
                CET Lounges, CME Gazebos, and Lower Campus Kiosks.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Video className="w-4 h-4 text-brand-teal-500" />
                <span>Remote Video Conference</span>
              </span>
              <p className="text-slate-500 text-xs">
                Google Meet, Zoom, and Discord screensharing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
