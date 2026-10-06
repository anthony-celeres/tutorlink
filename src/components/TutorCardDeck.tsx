"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Tutor } from "@/types";
import { useApp } from "@/context/AppContext";
import { MatchCelebrationModal } from "./MatchCelebrationModal";
import {
  X,
  Heart,
  RotateCcw,
  Info,
  Sparkles,
  ShieldCheck,
  Star,
  LayoutGrid,
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
  MapPin,
  Award,
  Check,
  Calendar,
} from "lucide-react";

export const TutorCardDeck: React.FC = () => {
  const { tutors } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFullBio, setShowFullBio] = useState(false);
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");
  const [matchModalTutor, setMatchModalTutor] = useState<Tutor | null>(null);

  // Filter tutors based on selected quick category
  const filteredTutors = useMemo(() => {
    if (selectedCategory === "All") return tutors;
    if (selectedCategory === "Under ₱160") return tutors.filter((t) => t.hourlyRate <= 160);
    return tutors.filter(
      (t) =>
        t.primarySubject.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        t.subjectsMastered.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  }, [tutors, selectedCategory]);

  const currentTutor = filteredTutors[currentIndex];

  const handlePass = () => {
    setShowFullBio(false);
    if (currentIndex < filteredTutors.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredTutors.length); // Deck completed
    }
  };

  const handleUndo = () => {
    setShowFullBio(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMatch = (tutorToMatch?: Tutor) => {
    const target = tutorToMatch || currentTutor;
    if (target) {
      setMatchModalTutor(target);
    }
  };

  const categories = [
    "All",
    "Microeconomics",
    "Calculus",
    "Organic Chem",
    "CMSC 21",
    "Stat 1",
    "Under ₱160",
  ];

  return (
    <div className="max-w-md mx-auto sm:max-w-2xl px-2 sm:px-4 py-2 sm:py-6 space-y-4">
      {/* Top Filter Chips Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setShowFullBio(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-brand-navy-700 dark:bg-brand-teal-500 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deck vs Grid view toggle */}
        <button
          onClick={() => setViewMode(viewMode === "deck" ? "grid" : "deck")}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-brand-navy-700 dark:hover:text-brand-teal-400 flex-shrink-0"
          title={viewMode === "deck" ? "Switch to Grid View" : "Switch to Deck View"}
        >
          {viewMode === "deck" ? <LayoutGrid className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </button>
      </div>

      {/* 1. CARD DECK VIEW */}
      {viewMode === "deck" && (
        <div className="flex flex-col items-center">
          {currentTutor ? (
            <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col transition-all duration-300">
              {/* Photo & Main Badge Banner */}
              <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-slate-900 group">
                <img
                  src={currentTutor.avatar}
                  alt={currentTutor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Top Badges: VSU Verified + Match Compatibility % */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" /> VSU Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md">
                    <Target className="w-3.5 h-3.5" />
                    <span>98% Match</span>
                  </span>
                </div>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                      {currentTutor.name}
                    </h2>
                    <span className="px-3 py-1 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-extrabold shadow-sm">
                      ₱{currentTutor.hourlyRate}/hr
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow">
                    {currentTutor.degree} • {currentTutor.yearLevel}
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-teal-500/90 text-white text-xs font-bold shadow-sm">
                      <BookOpen className="w-3 h-3" />
                      <span>{currentTutor.primarySubject}</span>
                    </span>
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1 drop-shadow">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {currentTutor.rating.toFixed(1)} ({currentTutor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Prompt Cards / Academic Info */}
              <div className="p-4 sm:p-5 space-y-3.5 bg-white dark:bg-slate-900">
                {/* Prompt 1: VSU Study Spot */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span>Favorite VSU Study Spot</span>
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {currentTutor.campusLocations[0] || "VSU Main Library (2nd Floor Cubicles)"}
                  </p>
                </div>

                {/* Prompt 2: Tutoring Style */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-teal-500" />
                    <span>My Mentoring Approach</span>
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {currentTutor.bio.slice(0, 110)}...
                  </p>
                </div>

                {/* Expand Full Bio Toggle */}
                {showFullBio && (
                  <div className="pt-2 space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-brand-teal-500" />
                        <span>Academic Credentials</span>
                      </span>
                      <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        {currentTutor.qualifications.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal-500" />
                        <span>Open Days & Timeslots</span>
                      </span>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {currentTutor.availabilityDays.join(", ")} • {currentTutor.timeslots[0]}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="w-full text-center text-sm font-bold text-brand-navy-700 dark:text-brand-teal-400 hover:underline flex items-center justify-center gap-1 py-1.5"
                >
                  <span>{showFullBio ? "Hide Details" : "View Full Profile & Credentials"}</span>
                  {showFullBio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Bottom Tinder-style Action Bar */}
              <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around gap-4">
                {/* Undo Button */}
                <button
                  onClick={handleUndo}
                  disabled={currentIndex === 0}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-amber-500 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100"
                  title="Undo / Previous Tutor"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Pass / Next Button */}
                <button
                  onClick={handlePass}
                  className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-rose-500 border-2 border-rose-200 dark:border-rose-900/60 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Pass"
                >
                  <X className="w-7 h-7" />
                </button>

                {/* Match / Connect Button */}
                <button
                  onClick={() => handleMatch()}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  title="Match & Connect"
                >
                  <Heart className="w-8 h-8 fill-white" />
                </button>

                {/* Details Button */}
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-brand-navy-600 dark:text-brand-teal-400 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  title="Details"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty Deck State */
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-lg my-8">
              <div className="w-16 h-16 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-600 dark:text-brand-teal-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                You&apos;ve checked all tutors!
              </h3>
              <p className="text-sm text-slate-500">
                You&apos;ve reviewed all available mentors in this category. Check your active matches or reset the card stack.
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 transition-colors"
                >
                  Review Again from Start
                </button>
                <Link
                  href="/chat"
                  className="w-full py-3 rounded-xl font-bold text-sm text-brand-teal-700 bg-brand-teal-50 dark:bg-slate-800 dark:text-brand-teal-400 text-center"
                >
                  View My Academic Matches
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. OPTIONAL QUICK GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {filteredTutors.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {t.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">{t.degree}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-teal-50 text-brand-teal-700 dark:bg-slate-800 dark:text-brand-teal-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.primarySubject}</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  ₱{t.hourlyRate}/hr
                </span>
                <button
                  onClick={() => handleMatch(t)}
                  className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "It's an Academic Match!" Modal */}
      <MatchCelebrationModal
        tutor={matchModalTutor}
        onClose={() => setMatchModalTutor(null)}
      />
    </div>
  );
};
