"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tutor } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  X,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { VSU_CAMPUS_LOCATIONS } from "@/data/mockData";

interface MatchCelebrationModalProps {
  tutor: Tutor | null;
  onClose: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  tutor,
  onClose,
}) => {
  const router = useRouter();
  const { currentUser, createBooking } = useApp();

  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>(
    tutor?.timeslots[0] || "Afternoon (2:00 PM - 4:00 PM)"
  );
  const [locationDetail, setLocationDetail] = useState<string>(
    tutor?.campusLocations[0] || VSU_CAMPUS_LOCATIONS[0]
  );
  const [quickNote, setQuickNote] = useState<string>("Excited to learn with you!");
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!tutor) return null;

  const handleConfirmMatchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const bookingId = createBooking({
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      menteeId: currentUser.id,
      menteeName: currentUser.name,
      menteeEmail: currentUser.email,
      subject: tutor.primarySubject,
      topic: "Academic Tutoring & Exam Prep",
      date,
      timeSlot,
      durationHours: 2,
      locationMode: locationDetail.includes("Online") ? "Online" : "VSU Campus",
      locationDetail,
      meetingLink: locationDetail.includes("Online") ? "https://meet.google.com/vsu-tutorlink" : undefined,
      learningStyle: tutor.learningStyles[0] || "Visual",
      notes: quickNote,
      hourlyRate: tutor.hourlyRate,
      totalAmount: tutor.hourlyRate * 2,
      referenceNumber: `TL-VSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: "In-person Cash / GCash directly to tutor",
    });

    setCreatedBookingId(bookingId);
    setIsBooked(true);
  };

  const handleOpenChat = () => {
    onClose();
    if (createdBookingId) {
      router.push(`/chat?id=${createdBookingId}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <>
            {/* Celebration Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Connection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                It&apos;s an Academic Match!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                You and <strong>{tutor.name}</strong> are an ideal study match for{" "}
                <span className="text-brand-navy-700 dark:text-brand-teal-400 font-bold">
                  {tutor.primarySubject}
                </span>
                !
              </p>
            </div>

            {/* Dual Avatars - Tinder style */}
            <div className="flex items-center justify-center -space-x-4 py-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-slate-200 z-10">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Heart/Emblem Center Badge */}
              <div className="relative z-20 w-12 h-12 rounded-full bg-gradient-to-br from-brand-navy-700 to-brand-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-pulse">
                <div className="w-6 h-6 relative">
                  <Image
                    src="/tutorlink_logo.png"
                    alt="Logo"
                    fill
                    className="object-contain brightness-200"
                  />
                </div>
              </div>

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-slate-200 z-10">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quick 1-Step Session Confirmation Form */}
            <form onSubmit={handleConfirmMatchBooking} className="space-y-3.5 text-left pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>Tutoring Rate:</span>
                  <span className="font-extrabold text-brand-navy-700 dark:text-brand-teal-400 text-sm">
                    ₱{tutor.hourlyRate} / hr
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                      Day
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                      Timeslot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                    >
                      {tutor.timeslots.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot.split("(")[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Meetup Location
                  </label>
                  <select
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  >
                    {tutor.campusLocations.map((loc, idx) => (
                      <option key={idx} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="Online (Google Meet)">Online (Google Meet)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    First Message to {tutor.name.split(" ")[0]}
                  </label>
                  <input
                    type="text"
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="Say hello or what you need help with..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect & Send First Message</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl font-semibold text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Keep Browsing
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Message & Session Sent!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can now chat in real-time with {tutor.name} to coordinate your study session.
              </p>
            </div>
            <button
              onClick={handleOpenChat}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Open Chat Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
