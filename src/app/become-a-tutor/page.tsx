"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  BookOpen,
  User,
  Award,
  Star,
  Target,
  MapPin,
  Coins,
  Check,
} from "lucide-react";
import { VSU_CAMPUS_LOCATIONS } from "@/data/mockData";

export default function BecomeTutorPage() {
  const router = useRouter();
  const { addTutor } = useApp();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdTutorId, setCreatedTutorId] = useState<string | null>(null);

  // Stage 3: Form State
  // 1. Personal Details
  const [name, setName] = useState("Maria Santos");
  const [email, setEmail] = useState("maria.santos@vsu.edu.ph");
  const [vsuId, setVsuId] = useState("21-1-0482");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  );

  // 2. Academic Profile
  const [degreeProgram, setDegreeProgram] = useState("BS Agriculture – 3rd Year");
  const [subjectsMastered, setSubjectsMastered] = useState<string[]>([
    "Microeconomics",
    "Macroeconomics",
    "Agri 11",
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [hasGradeProof, setHasGradeProof] = useState<boolean>(true);

  // 3. Qualifications & Achievements
  const [qualifications, setQualifications] = useState<string[]>([
    "Dean's Lister (Honor Standing)",
    "Consistent Academic Scholar",
  ]);
  const [customQualInput, setCustomQualInput] = useState("");
  const [tutoringExperience, setTutoringExperience] = useState<string>(
    "Prior Peer Tutor (1+ years experience guiding fellow students)"
  );

  // 4. Weekly Availability & Venue
  const [availabilityDays, setAvailabilityDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    "4:00 PM – 7:00 PM"
  );
  const [preferredVenue, setPreferredVenue] = useState<
    "In-person (On-Campus)" | "Remote / Online" | "Hybrid (Both On-Campus & Online)"
  >("Hybrid (Both On-Campus & Online)");
  const [hourlyRate, setHourlyRate] = useState<number>(150);
  const [bio, setBio] = useState(
    "Passionate peer mentor dedicated to simplifying difficult concepts step-by-step and helping peers build genuine academic confidence."
  );

  // Avatar presets
  const sampleAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  ];

  const quickSubjects = [
    "Microeconomics",
    "Chem 11",
    "Math 21",
    "Agri 11",
    "CMSC 21",
    "Physics 11",
    "Stat 101",
    "Macroeconomics",
  ];

  const quickHonors = [
    "Dean's Lister (Honor Standing)",
    "Consistent Academic Scholar",
    "Top Scorer in Major Exams",
    "Department Student Council Officer",
  ];

  const toggleDay = (d: string) => {
    setAvailabilityDays((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const handleAddCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !subjectsMastered.includes(trimmed)) {
      setSubjectsMastered([...subjectsMastered, trimmed]);
      setCustomSubjectInput("");
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjectsMastered(subjectsMastered.filter((s) => s !== sub));
  };

  const toggleSubjectChip = (sub: string) => {
    if (subjectsMastered.includes(sub)) {
      setSubjectsMastered(subjectsMastered.filter((s) => s !== sub));
    } else {
      setSubjectsMastered([...subjectsMastered, sub]);
    }
  };

  const toggleHonorChip = (honor: string) => {
    if (qualifications.includes(honor)) {
      setQualifications(qualifications.filter((q) => q !== honor));
    } else {
      setQualifications([...qualifications, honor]);
    }
  };

  const handleAddCustomQual = () => {
    const trimmed = customQualInput.trim();
    if (trimmed && !qualifications.includes(trimmed)) {
      setQualifications([...qualifications, trimmed]);
      setCustomQualInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parts = degreeProgram.split("–").map((p) => p.trim());
    const degree = parts[0] || degreeProgram;
    const yearLevel = parts[1] || "3rd Year";

    const deliveryModes: ("Online" | "VSU Campus")[] =
      preferredVenue === "Remote / Online"
        ? ["Online"]
        : preferredVenue === "In-person (On-Campus)"
        ? ["VSU Campus"]
        : ["Online", "VSU Campus"];

    const newId = addTutor({
      name: name.trim() || "VSU Peer Tutor",
      avatar,
      email: email.includes("@vsu.edu.ph") ? email.trim() : `${email.trim()}@vsu.edu.ph`,
      vsuId: vsuId.trim() || "21-1-0482",
      degree,
      yearLevel,
      department: "Visayas State University Academic Division",
      subjectsMastered: subjectsMastered.length > 0 ? subjectsMastered : ["Microeconomics"],
      primarySubject: subjectsMastered[0] || "Microeconomics",
      learningStyles: ["Visual", "Discussion", "Practice / Problem Solving"],
      bio: bio.trim(),
      qualifications: qualifications.length > 0 ? qualifications : ["Dean's Lister (Honor Standing)"],
      tutoringExperience,
      hourlyRate,
      deliveryModes,
      campusLocations: [VSU_CAMPUS_LOCATIONS[0], VSU_CAMPUS_LOCATIONS[1]],
      availabilityDays: availabilityDays.length > 0 ? availabilityDays : ["Mon", "Wed", "Fri"],
      timeslots: [selectedTimeSlot],
    });

    setIsSubmitting(false);
    setCreatedTutorId(newId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950/70 border border-brand-teal-200 dark:border-brand-teal-800 text-brand-teal-700 dark:text-brand-teal-300 text-xs font-bold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Stage 3: Peer Tutor Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Become a TutorLink Mentor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Share your academic mastery, set your hourly rate in PHP, and mentor fellow VSU students on-campus or online.
        </p>
      </div>

      {createdTutorId ? (
        /* Confirmation State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Tutor Profile Published!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your tutor onboarding application has been verified. Students can now match with you and book peer tutoring sessions.
            </p>
          </div>

          {/* Published Card Preview (matching Section 4 wireframe style) */}
          <div className="max-w-lg mx-auto bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0 border border-white dark:border-slate-700">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{name}</span>
                  <span className="text-emerald-500" title="VSU Verified">
                    <ShieldCheck className="w-3.5 h-3.5 inline" />
                  </span>
                </h4>
                <p className="text-xs text-slate-500">{degreeProgram}</p>
                <div className="flex items-center gap-3 mt-1 text-xs font-bold">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0 (New Mentor)</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>Available for Matches</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                <span><strong>Subjects:</strong> {subjectsMastered.join(", ")}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                <span><strong>Available:</strong> {availabilityDays.join(", ")} ({selectedTimeSlot})</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                <span><strong>Venue:</strong> {preferredVenue}</span>
              </p>
              <p className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-brand-teal-500 flex-shrink-0" />
                <span><strong>Rate:</strong> ₱{hourlyRate} / hour</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(`/tutors/${createdTutorId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/results")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Explore Tutors Catalog
            </button>
          </div>
        </div>
      ) : (
        /* Stage 3 Single Direct Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
        >
          {/* SECTION 1: Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                1. Personal Details
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  VSU Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vsu.edu.ph"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Must be an official @vsu.edu.ph student address
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Student ID Number *
                </label>
                <input
                  type="text"
                  required
                  value={vsuId}
                  onChange={(e) => setVsuId(e.target.value)}
                  placeholder="e.g. 21-1-0482"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
                />
              </div>
            </div>

            {/* Profile Photo Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Profile Photo *
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {sampleAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-transform flex-shrink-0 ${
                      avatar === url
                        ? "border-brand-teal-500 scale-105 shadow-md ring-2 ring-brand-teal-400/40"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    {avatar === url && (
                      <div className="absolute inset-0 bg-brand-teal-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Profile & Areas of Expertise */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                2. Academic Profile & Areas of Expertise
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Degree Program & Year Level *
              </label>
              <select
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="BS Agriculture – 3rd Year">BS Agriculture – 3rd Year</option>
                <option value="BS Computer Science – 3rd Year">BS Computer Science – 3rd Year</option>
                <option value="BS Civil Engineering – 4th Year">BS Civil Engineering – 4th Year</option>
                <option value="BS Agribusiness – 2nd Year">BS Agribusiness – 2nd Year</option>
                <option value="BS Biology – 3rd Year">BS Biology – 3rd Year</option>
                <option value="BS Chemistry – 4th Year">BS Chemistry – 4th Year</option>
                <option value="BS Mechanical Engineering – 3rd Year">BS Mechanical Engineering – 3rd Year</option>
                <option value="BS Nursing – 2nd Year">BS Nursing – 2nd Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Areas of Expertise (Subjects Passed with High Marks) *
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Select from common VSU subjects or type below to add custom courses you feel confident tutoring.
              </p>

              {/* Selected subjects */}
              <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px]">
                {subjectsMastered.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-brand-navy-50 text-brand-navy-800 dark:bg-slate-800 dark:text-brand-teal-300 border border-brand-navy-200 dark:border-slate-700"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom subject */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSubject();
                    }
                  }}
                  placeholder="Add subject (e.g. Math 21, Econ 11, Chem 11)..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  className="px-4 py-2 rounded-xl bg-brand-navy-700 hover:bg-brand-navy-800 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick subject chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs text-slate-400 self-center mr-1 font-medium">Quick Add:</span>
                {quickSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubjectChip(sub)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      subjectsMastered.includes(sub)
                        ? "bg-brand-teal-500 text-white border-brand-teal-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-teal-400"
                    }`}
                  >
                    {subjectsMastered.includes(sub) && <Check className="w-3.5 h-3.5" />}
                    <span>{sub}</span>
                  </button>
                ))}
              </div>

              {/* Grade verification proof optional */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Grade Proof Verification (Optional)
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Certify you earned a 1.00 – 1.75 in these subjects for automatic VSU peer badge.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGradeProof}
                    onChange={(e) => setHasGradeProof(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 3: Qualifications & Tutoring Experience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                3. Qualifications & Tutoring Experience
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Qualifications & Achievements
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickHonors.map((honor) => (
                  <button
                    key={honor}
                    type="button"
                    onClick={() => toggleHonorChip(honor)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      qualifications.includes(honor)
                        ? "bg-brand-navy-700 text-white border-brand-navy-800 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {qualifications.includes(honor) && <Check className="w-3 h-3 text-brand-teal-300" />}
                    <span>{honor}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQualInput}
                  onChange={(e) => setCustomQualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomQual();
                    }
                  }}
                  placeholder="Other academic honors or certifications..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomQual}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Add Honor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Tutoring Experience *
              </label>
              <div className="space-y-2">
                {[
                  {
                    title: "Prior Peer Tutor (1+ years)",
                    desc: "Have conducted 1-on-1 peer tutorials with demonstrated student grade improvement.",
                  },
                  {
                    title: "Group Study Leader / Moderator",
                    desc: "Organized departmental study circles, exam reviews, or laboratory walkthroughs.",
                  },
                  {
                    title: "Informal Mentoring / First-Time Peer Tutor",
                    desc: "Helped classmates informally and ready to begin official peer tutoring on TutorLink.",
                  },
                ].map((exp) => (
                  <label
                    key={exp.title}
                    onClick={() => setTutoringExperience(exp.title)}
                    className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                      tutoringExperience.startsWith(exp.title.slice(0, 15))
                        ? "bg-brand-navy-50/70 dark:bg-slate-800 border-brand-teal-500 ring-1 ring-brand-teal-400"
                        : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                          {exp.title}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {exp.desc}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          tutoringExperience.startsWith(exp.title.slice(0, 15))
                            ? "border-brand-teal-500 bg-brand-teal-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {tutoringExperience.startsWith(exp.title.slice(0, 15)) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: Weekly Availability, Venue & Rate */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-brand-teal-500" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                4. Weekly Availability, Venue & Hourly Rate
              </h2>
            </div>

            {/* Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Weekly Available Days *
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      availabilityDays.includes(day)
                        ? "bg-brand-navy-700 text-white border-brand-navy-800 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Available time slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Time Slot *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "4:00 PM – 7:00 PM",
                  "1:00 PM – 4:00 PM",
                  "8:00 AM – 12:00 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      selectedTimeSlot === slot
                        ? "bg-brand-teal-50 text-brand-teal-800 border-brand-teal-400 dark:bg-brand-teal-950 dark:text-brand-teal-300 ring-1 ring-brand-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Venue */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Session Venue *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    mode: "In-person (On-Campus)" as const,
                    desc: "VSU Library, Eco-Park, Sheds",
                  },
                  {
                    mode: "Remote / Online" as const,
                    desc: "Google Meet, Zoom, Discord",
                  },
                  {
                    mode: "Hybrid (Both On-Campus & Online)" as const,
                    desc: "Flexible on-campus or virtual",
                  },
                ].map((venueOption) => (
                  <button
                    key={venueOption.mode}
                    type="button"
                    onClick={() => setPreferredVenue(venueOption.mode)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      preferredVenue === venueOption.mode
                        ? "bg-brand-teal-50 text-brand-teal-900 border-brand-teal-400 dark:bg-brand-teal-950 dark:text-brand-teal-200 ring-1 ring-brand-teal-400"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold block">{venueOption.mode}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {venueOption.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Hourly Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Standard Hourly Rate *
                </label>
                <span className="text-lg sm:text-xl font-extrabold text-brand-navy-700 dark:text-brand-teal-400">
                  ₱{hourlyRate} / hour
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="350"
                step="10"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full accent-brand-teal-500 cursor-pointer h-2"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>₱100/hr (Min)</span>
                <span>Recommended: ₱120 – ₱200/hr</span>
                <span>₱350/hr (Max)</span>
              </div>
            </div>

            {/* Short Bio / Teaching Philosophy */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Short Bio / Teaching Philosophy *
              </label>
              <textarea
                rows={2}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="1–2 sentences explaining your tutoring approach (e.g., patient step-by-step problem solving)..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm sm:text-base outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>
          </div>

          {/* Action Button: [Submit Tutor Application] */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isSubmitting ? "Submitting Application..." : "Submit Tutor Application"}</span>
            </button>
            <p className="text-xs text-center text-slate-400 mt-2">
              By submitting, your tutor profile becomes instantly discoverable by VSU students in search results.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
