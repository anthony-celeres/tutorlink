"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  X,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Info,
} from "lucide-react";

export const BookingModal: React.FC = () => {
  const router = useRouter();
  const {
    bookingModalTutor,
    closeBookingModal,
    createBooking,
    currentUser,
    isAuthenticated,
  } = useApp();

  const tutor = bookingModalTutor;

  // Form states matching Section 5
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [specificTopic, setSpecificTopic] = useState<string>("Supply and Demand");
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-07");
  const [sessionTime, setSessionTime] = useState<string>("4:30 PM – 5:30 PM (1 hour)");
  const [venue, setVenue] = useState<string>(
    "VSU University Library (Discussion Room 2)"
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    "In-person Cash / GCash directly to tutor"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [createdBookingReference, setCreatedBookingReference] = useState<string>("");
  const [createdBookingId, setCreatedBookingId] = useState<string>("");

  React.useEffect(() => {
    if (tutor) {
      setSelectedSubject(tutor.primarySubject);
      setBookingConfirmed(false);
      setCreatedBookingReference("");
      setCreatedBookingId("");
    }
  }, [tutor]);

  if (!tutor) return null;

  const totalFee = tutor.hourlyRate; // 1 hour session fee per spec

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      closeBookingModal();
      router.push(
        `/signup?redirect=${encodeURIComponent(`/tutors/${tutor.id}?book=true`)}&tutor=${encodeURIComponent(tutor.name)}`
      );
      return;
    }

    setIsSubmitting(true);

    const refNum = `TL-VSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const id = createBooking({
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      menteeId: currentUser.id,
      menteeName: currentUser.name,
      menteeEmail: currentUser.email,
      subject: selectedSubject || tutor.primarySubject,
      topic: specificTopic || "General Topic Review",
      date: selectedDate,
      timeSlot: sessionTime,
      durationHours: 1,
      locationMode: venue.includes("Google Meet") ? "Online" : "VSU Campus",
      locationDetail: venue,
      meetingLink: venue.includes("Google Meet") ? "https://meet.google.com/vsu-tutorlink" : undefined,
      learningStyle: "Visual & Concept-driven",
      notes: `Payment method: ${paymentMethod}`,
      hourlyRate: tutor.hourlyRate,
      totalAmount: totalFee,
      referenceNumber: refNum,
      paymentMethod,
    });

    setCreatedBookingId(id);
    setCreatedBookingReference(refNum);
    setIsSubmitting(false);
    setBookingConfirmed(true);
  };

  const handleOpenChat = () => {
    closeBookingModal();
    if (createdBookingId) {
      router.push(`/chat?id=${createdBookingId}`);
    } else {
      router.push("/chat");
    }
  };

  const handleCalendarSync = () => {
    const title = encodeURIComponent(`TutorLink Session: ${tutor.name} (${selectedSubject})`);
    const details = encodeURIComponent(
      `TutorLink Mentoring Session with ${tutor.name}.\nSubject: ${selectedSubject} - ${specificTopic}\nVenue: ${venue}\nPayment: ${paymentMethod} (₱${totalFee})\nRef: ${createdBookingReference}`
    );
    const location = encodeURIComponent(venue);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
              <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {bookingConfirmed ? "Booking Confirmed!" : "Booking Confirmation"}
              </h3>
              <p className="text-xs text-slate-500">
                Tutor: <span className="font-semibold text-slate-800 dark:text-slate-200">{tutor.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!bookingConfirmed ? (
            /* SECTION 5 FORM */
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs sm:text-sm">
                {/* Tutor */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-semibold text-slate-500">Tutor:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{tutor.name}</span>
                </div>

                {/* Subject & Topic */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subject & Topic *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    >
                      {tutor.subjectsMastered.map((s, idx) => (
                        <option key={idx} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={specificTopic}
                      onChange={(e) => setSpecificTopic(e.target.value)}
                      placeholder="e.g. Supply and Demand"
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Selected Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Selected Date *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Session Time *
                    </label>
                    <select
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value="4:30 PM – 5:30 PM (1 hour)">4:30 PM – 5:30 PM (1 hour)</option>
                      <option value="5:30 PM – 6:30 PM (1 hour)">5:30 PM – 6:30 PM (1 hour)</option>
                      <option value="2:00 PM – 3:00 PM (1 hour)">2:00 PM – 3:00 PM (1 hour)</option>
                      <option value="10:00 AM – 11:00 AM (1 hour)">10:00 AM – 11:00 AM (1 hour)</option>
                    </select>
                  </div>
                </div>

                {/* Venue */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Venue *
                  </label>
                  <select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="VSU University Library (Discussion Room 2)">
                      VSU University Library (Discussion Room 2)
                    </option>
                    <option value="VSU University Library (2nd Floor Cubicles)">
                      VSU University Library (2nd Floor Cubicles)
                    </option>
                    <option value="Student Union Building (SUB) Study Lounge">
                      Student Union Building (SUB) Study Lounge
                    </option>
                    <option value="Lower Campus Gazebos">
                      Lower Campus Gazebos
                    </option>
                    <option value="Online (Google Meet link)">
                      Online (Google Meet link)
                    </option>
                  </select>
                </div>

                {/* Total Fee & Payment Method */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Fee:</span>
                    <span className="text-xl font-extrabold text-brand-navy-700 dark:text-brand-teal-400">
                      ₱{totalFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <label className="text-xs font-bold text-slate-500 block mb-1">
                      Payment Method:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-brand-teal-500"
                    >
                      <option value="In-person Cash / GCash directly to tutor">
                        In-person Cash / GCash directly to tutor
                      </option>
                      <option value="GCash directly to tutor">
                        GCash directly to tutor
                      </option>
                      <option value="In-person Cash directly to tutor">
                        In-person Cash directly to tutor
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-2 active:scale-95"
                >
                  {isSubmitting
                    ? "Confirming..."
                    : !isAuthenticated
                    ? "Sign Up to Confirm Booking"
                    : "Confirm Booking"}
                </button>
              </div>
            </form>
          ) : (
            /* SECTION 6 POST-BOOKING CONFIRMATION SCREEN */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Session Reservation Confirmed!
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Your peer mentoring session with <strong>{tutor.name}</strong> is scheduled.
                </p>
              </div>

              {/* Booking Reference Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-semibold">Booking Reference No.:</span>
                  <span className="font-mono font-extrabold text-brand-navy-700 dark:text-brand-teal-400 text-sm sm:text-base">
                    {createdBookingReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject & Topic:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedSubject} — {specificTopic}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedDate} • {sessionTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {venue}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
                  <span className="text-slate-500">Fee:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ₱{totalFee.toFixed(2)} (Direct Cash / GCash to tutor)
                  </span>
                </div>
              </div>

              {/* Session Guidelines */}
              <div className="p-3.5 rounded-2xl bg-brand-navy-50/60 dark:bg-brand-navy-950/40 border border-brand-navy-200/60 dark:border-brand-navy-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-brand-navy-800 dark:text-brand-teal-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-teal-500" />
                  <span>VSU Peer Session Guidelines:</span>
                </span>
                <p>• Arrive 5 minutes prior to session time at the designated campus room.</p>
                <p>• Bring your VSU Student ID card and course syllabus/problem sets.</p>
                <p>• Settle the tutoring fee directly with your peer tutor upon session completion.</p>
              </div>

              {/* Actions: Add to Calendar + Built-in Chat */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCalendarSync}
                  className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Calendar className="w-4 h-4 text-brand-teal-500" />
                  <span>Sync Google Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-brand-navy-700 hover:bg-brand-navy-800 shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Built-in Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
