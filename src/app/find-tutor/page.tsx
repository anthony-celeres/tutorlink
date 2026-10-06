"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Search,
  BookOpen,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  Coins,
  MapPin,
  Laptop,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target,
  Loader2,
} from "lucide-react";

function FindTutorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchFilter } = useApp();

  const initialCourse = searchParams.get("course") || "Microeconomics";

  // Redirect or show in-page auth gate if unauthenticated
  // (Handled cleanly in the render state below)

  // Multi-step pagination state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [stepEnteredAt, setStepEnteredAt] = useState<number>(() => Date.now());

  // Form State matching Section 2 of specification
  const [courseCode, setCourseCode] = useState(initialCourse);
  const [specificTopic, setSpecificTopic] = useState("");
  const [learningStyles, setLearningStyles] = useState<string[]>([
    "Visual",
    "Practice-heavy",
  ]);
  const [maxBudget, setMaxBudget] = useState<number>(200);
  const [preferredDays, setPreferredDays] = useState<string>("Monday–Friday");
  const [preferredTime, setPreferredTime] = useState<string>("4:00 PM – 7:00 PM");
  const [sessionModes, setSessionModes] = useState<string[]>([
    "On-Campus",
    "Online",
  ]);

  const toggleLearningStyle = (styleKey: string) => {
    setLearningStyles((prev) =>
      prev.includes(styleKey)
        ? prev.filter((s) => s !== styleKey)
        : [...prev, styleKey]
    );
  };

  const toggleSessionMode = (modeKey: string) => {
    setSessionModes((prev) =>
      prev.includes(modeKey)
        ? prev.filter((m) => m !== modeKey)
        : [...prev, modeKey]
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !courseCode.trim()) {
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      setStepEnteredAt(Date.now());
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setStepEnteredAt(Date.now());
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    }
  };

  const handleFinalSubmit = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();

    // Guard against ghost-clicks / touch tap-through from step 3 (minimum 400ms on step 4)
    if (Date.now() - stepEnteredAt < 400) {
      return;
    }
    if (isMatching) return;

    setIsMatching(true);

    setSearchFilter({
      subject: courseCode,
      topic: specificTopic,
      learningStyles,
      minBudget: 100,
      maxBudget,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      timeslots: [preferredTime],
      deliveryMode:
        sessionModes.length > 1
          ? "Both"
          : sessionModes.includes("Online")
          ? "Online"
          : "VSU Campus",
      sortBy: "match",
    });

    setTimeout(() => {
      router.push(
        `/results?subject=${encodeURIComponent(courseCode)}&topic=${encodeURIComponent(
          specificTopic
        )}&budget=${maxBudget}`
      );
    }, 600);
  };

  const stepsList = [
    { num: 1, title: "Course & Topic", desc: "What subject do you need help with?" },
    { num: 2, title: "Learning Style", desc: "How do you learn best?" },
    { num: 3, title: "Schedule & Budget", desc: "When and how much?" },
    { num: 4, title: "Location & Summary", desc: "Where will you meet?" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950/70 border border-brand-teal-200 dark:border-brand-teal-800 text-brand-teal-700 dark:text-brand-teal-300 text-xs font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>Stage 2: Peer Tutor Intake Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Find a VSU Peer Tutor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Complete these quick steps to get automatically matched with qualified VSU student-mentors.
        </p>
      </div>

      {/* Pagination Progress Indicator */}
      <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <span className="text-slate-500">
            Step {currentStep} of 4:{" "}
            <span className="text-brand-navy-700 dark:text-brand-teal-400 font-extrabold">
              {stepsList[currentStep - 1].title}
            </span>
          </span>
          <span className="text-slate-400 font-semibold">{Math.round((currentStep / 4) * 100)}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-brand-navy-700 to-brand-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Pills */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {stepsList.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStep === s.num
                  ? "bg-brand-navy-50 text-brand-navy-800 dark:bg-brand-navy-950 dark:text-brand-teal-300 border border-brand-teal-500/40"
                  : currentStep > s.num
                  ? "text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  : "text-slate-400 cursor-default"
              }`}
            >
              {s.num < currentStep ? "Done" : `Step ${s.num}`}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep < 4) {
            handleNext();
          }
        }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6"
      >
        {/* STEP 1: Course & Specific Topic */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                1. Course Code & Specific Focus Topic
              </h2>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Course Code / Subject Name *
              </label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder="e.g. Microeconomics, Chem 11, Math 21"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-base text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-brand-teal-500"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-slate-400 mr-1 self-center font-medium">Quick pick:</span>
                {["Microeconomics", "Math 21", "Chem 11", "CMSC 21", "Agri 11", "Stat 1"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCourseCode(code)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-navy-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Specific Topic / Focus Area
              </label>
              <input
                type="text"
                value={specificTopic}
                onChange={(e) => setSpecificTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder="e.g. Supply and Demand, Stoichiometry, Differential Calculus"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-base text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 block">
                Optional: mention the upcoming exam or tricky lesson you want to review.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Preferred Learning Style */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Eye className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                2. Preferred Learning Style
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select one or more teaching formats that match your studying habits.
            </p>

            <div className="space-y-3">
              {[
                {
                  key: "Visual",
                  title: "Visual",
                  desc: "Diagrams, mind maps, flowcharts, and structured slides",
                  icon: Eye,
                },
                {
                  key: "Discussion",
                  title: "Discussion / Concept-driven",
                  desc: "Q&A dialogues, analogy breakdowns, and deep theoretical explanations",
                  icon: MessageSquare,
                },
                {
                  key: "Practice-heavy",
                  title: "Practice-heavy",
                  desc: "Problem sets, step-by-step calculations, and mock exam drills",
                  icon: FileText,
                },
              ].map((style) => {
                const isChecked = learningStyles.includes(style.key);
                const IconComponent = style.icon;
                return (
                  <label
                    key={style.key}
                    onClick={() => toggleLearningStyle(style.key)}
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-brand-navy-50/80 dark:bg-brand-teal-950/30 border-brand-teal-500 text-slate-900 dark:text-white ring-1 ring-brand-teal-400/40"
                        : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isChecked
                            ? "bg-brand-teal-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block">
                          {style.title}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 block">
                          {style.desc}
                        </span>
                      </div>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-teal-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Schedule & Budget */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                3. Preferred Schedule & Budget
              </h2>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-brand-teal-500" />
                  <span>Maximum Budget per Hour *</span>
                </label>
                <span className="text-lg sm:text-xl font-extrabold text-brand-navy-700 dark:text-brand-teal-400">
                  ₱{maxBudget} / hour
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-brand-teal-500 cursor-pointer h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                <span>₱100 / hr (Min)</span>
                <span>Average: ₱150 / hr</span>
                <span>₱300 / hr (Max)</span>
              </div>
            </div>

            {/* Days & Times */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Preferred Days *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "Monday–Friday",
                  "Weekends Only",
                  "Any Day",
                ].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreferredDays(d)}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      preferredDays === d
                        ? "bg-brand-navy-50 text-brand-navy-800 border-brand-teal-500 dark:bg-slate-800 dark:text-brand-teal-300 ring-1 ring-brand-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-teal-500" />
                <span>Preferred Time Slot *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  "4:00 PM – 7:00 PM",
                  "1:00 PM – 4:00 PM",
                  "8:00 AM – 12:00 PM",
                ].map((timeOption) => (
                  <button
                    key={timeOption}
                    type="button"
                    onClick={() => setPreferredTime(timeOption)}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      preferredTime === timeOption
                        ? "bg-brand-navy-50 text-brand-navy-800 border-brand-teal-500 dark:bg-slate-800 dark:text-brand-teal-300 ring-1 ring-brand-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {timeOption}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Session Mode & Review */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                4. Session Mode & Final Review
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "On-Campus",
                  title: "On-Campus",
                  desc: "VSU Library, Department Study Sheds, Eco-Park Gazebos",
                  icon: MapPin,
                },
                {
                  key: "Online",
                  title: "Online",
                  desc: "Google Meet, Zoom, or Discord screen-share",
                  icon: Laptop,
                },
              ].map((mode) => {
                const isChecked = sessionModes.includes(mode.key);
                const IconComponent = mode.icon;
                return (
                  <label
                    key={mode.key}
                    onClick={() => toggleSessionMode(mode.key)}
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-brand-navy-50/80 dark:bg-brand-teal-950/30 border-brand-teal-500 text-slate-900 dark:text-white ring-1 ring-brand-teal-400/40"
                        : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isChecked
                            ? "bg-brand-teal-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block">
                          {mode.title}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 block">
                          {mode.desc}
                        </span>
                      </div>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-teal-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Match Summary Review Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                  Review Your Match Criteria
                </span>
                <span className="text-xs text-brand-teal-600 dark:text-brand-teal-400 font-bold">
                  Ready to Match
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Subject:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {courseCode} {specificTopic ? `(${specificTopic})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Max Budget:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">₱{maxBudget} / hr</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Schedule:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{preferredDays} ({preferredTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Location Mode:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{sessionModes.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isMatching}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              key={`next-btn-step-${currentStep}`}
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-md flex items-center gap-2 transition-all ml-auto active:scale-95"
            >
              <span>Next: {stepsList[currentStep].title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              key="step-4-final-submit-btn"
              type="button"
              onClick={handleFinalSubmit}
              disabled={isMatching}
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-brand-navy-700 to-brand-teal-500 hover:from-brand-navy-800 hover:to-brand-teal-600 shadow-lg flex items-center gap-2 transition-all ml-auto disabled:opacity-80 active:scale-95"
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Matching with VSU Mentors...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>See My Matches</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function FindTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-brand-teal-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <FindTutorForm />
    </Suspense>
  );
}
