"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Booking } from "@/types";
import {
  Send,
  Calendar,
  Video,
  ArrowLeft,
  Info,
  BookOpen,
  MapPin,
  Clock,
  Lock,
} from "lucide-react";

const QUICK_RESPONSES = [
  "On my way",
  "At VSU Library",
  "Ready for session",
  "Where are you located?",
  "Can you share the syllabus?",
  "Need to reschedule",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const { bookings, messages, sendMessage, role, isAuthenticated } = useApp();

  const urlBookingId = searchParams.get("id");

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    urlBookingId || (bookings[0]?.id ?? "")
  );

  const userRole: "mentee" | "tutor" = role === "tutor" ? "tutor" : "mentee";

  const [inputMessage, setInputMessage] = useState("");
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (urlBookingId) {
      setSelectedBookingId(urlBookingId);
    } else if (bookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(bookings[0].id);
    }
  }, [urlBookingId, bookings, selectedBookingId]);

  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];
  const activeMessages = useMemo(() => {
    return selectedBookingId ? messages[selectedBookingId] || [] : [];
  }, [selectedBookingId, messages]);

  // Filter out quick chips that have already been sent in this conversation
  const availableQuickChips = useMemo(() => {
    const sentTexts = new Set(
      activeMessages.map((m) => m.text.trim().toLowerCase())
    );
    return QUICK_RESPONSES.filter(
      (chip) => !sentTexts.has(chip.trim().toLowerCase())
    );
  }, [activeMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedBookingId) return;

    const textToSend = inputMessage.trim();
    sendMessage(selectedBookingId, textToSend, userRole);
    setInputMessage("");

    // Simulate peer reply if mentee sends a message
    if (userRole === "mentee" && currentBooking) {
      setTimeout(() => {
        const simulatedReplies = [
          "Got it! I am ready with my notes and summary diagrams.",
          "Noted! See you at our scheduled campus study spot.",
          "Awesome! Feel free to bring any specific problem sets or exam questions.",
          "I'm at the designated venue now. Looking forward to our session!",
        ];
        const randomReply =
          simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];
        sendMessage(selectedBookingId, randomReply, "tutor");
      }, 800);
    }
  };

  const handleQuickChip = (text: string) => {
    if (!selectedBookingId) return;
    sendMessage(selectedBookingId, text, userRole);

    if (userRole === "mentee" && currentBooking) {
      setTimeout(() => {
        let reply = "Got it! Looking forward to our session.";
        if (text.includes("located")) {
          reply = `I'm at ${currentBooking.locationDetail}. Looking forward to our session!`;
        } else if (text.includes("Library")) {
          reply = "See you at VSU Main Library! I'll be wearing a green VSU lanyard.";
        } else if (text.includes("way")) {
          reply = "Take your time! I'll be waiting here.";
        } else if (text.includes("Ready")) {
          reply = "Awesome! Let's dive straight into the problem sets.";
        } else if (text.includes("syllabus")) {
          reply = "Yes, I brought the course outline and practice problem sets.";
        } else if (text.includes("reschedule")) {
          reply = "No problem! Let me know what alternative time slot works best for you.";
        }
        sendMessage(selectedBookingId, reply, "tutor");
      }, 800);
    }
  };

  const handleCalendarSync = (b: Booking) => {
    const title = encodeURIComponent(`TutorLink Session: ${b.tutorName} (${b.subject})`);
    const details = encodeURIComponent(
      `TutorLink Mentoring Session with ${b.tutorName}.\nSubject: ${b.subject} - ${b.topic}\nVenue: ${b.locationDetail}\nPayment: ${b.paymentMethod || "In-person Cash / GCash directly to tutor"} (₱${b.totalAmount})\nRef: ${b.referenceNumber || "TL-VSU-2026-8942"}`
    );
    const location = encodeURIComponent(b.locationDetail);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  // Unauthenticated screen with direct login and signup links
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-x-0 top-16 bottom-16 z-30 md:static md:inset-auto md:w-full md:max-w-5xl md:mx-auto md:px-4 md:py-8 md:h-[84vh] flex items-center justify-center p-4 bg-white dark:bg-slate-900 md:bg-transparent">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-brand-navy-50 dark:bg-slate-800 text-brand-teal-500 border border-brand-teal-500/30 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-brand-teal-600 dark:text-brand-teal-400 uppercase tracking-widest">
              Private VSU Session Chat
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Log In to Access Your Sessions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your tutoring conversations and session coordination are private and secured. Please sign in to your VSU student account to access your chat.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/login?redirect=/chat"
              className="w-full py-3.5 rounded-2xl bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer active:scale-95 text-center"
            >
              Log In to TutorLink
            </Link>
            <Link
              href="/signup?redirect=/chat"
              className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer active:scale-95 shadow-xs text-center"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-16 z-30 md:static md:inset-auto md:w-full md:max-w-5xl md:mx-auto md:px-4 md:py-4 md:h-[84vh] flex flex-col bg-white dark:bg-slate-900 md:bg-transparent md:dark:bg-transparent">
      {/* Desktop Top Header */}
      <div className="hidden md:flex items-center justify-between mb-3 px-1">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Messages & Sessions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct communication and session coordination with your VSU peer tutors.
          </p>
        </div>
      </div>

      {/* Main Container: Native Edge-to-Edge on mobile, 2-column card on desktop */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 md:gap-4 overflow-hidden h-full">
        {/* Left Col: Conversations List (full screen on mobile when no chat is selected) */}
        <div
          className={`md:col-span-5 bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-slate-800 md:rounded-3xl flex flex-col overflow-hidden shadow-xs h-full ${
            selectedBookingId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Mobile Header for Conversations List */}
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between md:hidden bg-white dark:bg-slate-900 flex-shrink-0">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Messages</h2>
              <p className="text-[11px] text-slate-400">{bookings.length} active sessions</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link
                href="/find-tutor"
                className="p-1.5 rounded-full text-brand-teal-600 dark:text-brand-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Browse Tutors"
              >
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Desktop Header for Conversations List */}
          <div className="hidden md:flex items-center justify-between p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Conversations ({bookings.length})
            </span>
            <Link
              href="/find-tutor"
              className="text-xs font-bold text-brand-teal-600 dark:text-brand-teal-400 hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Tutors</span>
            </Link>
          </div>

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {bookings.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No active conversations yet. Match with a tutor to begin chatting!
              </div>
            ) : (
              bookings.map((b) => {
                const isSelected = b.id === selectedBookingId;
                const lastMsg = messages[b.id]?.slice(-1)[0];

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-navy-50 dark:bg-slate-800/80 border-brand-teal-500/50 shadow-xs"
                        : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <img src={b.tutorAvatar} alt={b.tutorName} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {b.tutorName}
                          </h4>
                          <span className="text-xs text-brand-navy-700 dark:text-brand-teal-400 font-extrabold">
                            ₱{b.totalAmount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                            {lastMsg ? lastMsg.text : `${b.subject} session`}
                          </p>
                          <span className="text-[11px] text-slate-400 flex-shrink-0">
                            {lastMsg?.timestamp || "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Native Edge-to-Edge Chat Screen on mobile, Card on desktop */}
        <div
          className={`md:col-span-7 bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-slate-800 md:rounded-3xl flex flex-col overflow-hidden shadow-xs h-full w-full ${
            !selectedBookingId ? "hidden md:flex" : "flex"
          }`}
        >
          {currentBooking ? (
            <>
              {/* 1. Sleek Single-Tier Chat Header */}
              <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0 z-10 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingId("")}
                    className="md:hidden p-1.5 -ml-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Back to conversations"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={currentBooking.tutorAvatar}
                      alt={currentBooking.tutorName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight truncate">
                      {currentBooking.tutorName}
                    </h3>
                    <p className="text-[11px] text-brand-teal-600 dark:text-brand-teal-400 font-semibold flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="truncate">{currentBooking.subject} Tutor</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {currentBooking.locationMode === "Online" && (
                    <a
                      href="https://meet.google.com/vsu-tutorlink"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs transition-colors"
                      title="Join Google Meet"
                    >
                      <Video className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowGuidelines(!showGuidelines)}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      showGuidelines
                        ? "bg-brand-navy-700 text-white border-brand-navy-700 dark:bg-brand-teal-500 dark:border-brand-teal-500"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                    title="Session details"
                    aria-label="Session details"
                  >
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">Details</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Session Details Drawer */}
              {showGuidelines && (
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-md flex-shrink-0 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Venue & Mode:</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-teal-500" />
                        <span>{currentBooking.locationDetail} ({currentBooking.locationMode})</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Schedule:</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-teal-500" />
                        <span>{currentBooking.date} • {currentBooking.timeSlot}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Fee & Payment:</span>
                      <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                        ₱{currentBooking.totalAmount.toFixed(2)} — {currentBooking.paymentMethod || "Direct to Tutor"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Calendar:</span>
                      <button
                        type="button"
                        onClick={() => handleCalendarSync(currentBooking)}
                        className="mt-0.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3 text-brand-teal-500" />
                        <span>Add to Google Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Messages Stream */}
              <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-3 space-y-2.5 bg-slate-50/60 dark:bg-[#090e17]">
                {/* Elegant In-stream Session Chip */}
                <div className="flex justify-center my-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs text-[11px] text-slate-600 dark:text-slate-300 max-w-[94%]">
                    <span className="font-semibold text-brand-navy-700 dark:text-brand-teal-400 truncate">
                      {currentBooking.subject}
                    </span>
                    <span>•</span>
                    <span className="truncate">{currentBooking.topic}</span>
                    <span className="font-mono text-[10px] text-slate-400 flex-shrink-0 hidden xs:inline">
                      Ref: {currentBooking.referenceNumber || "TL-VSU-2026-8942"}
                    </span>
                  </div>
                </div>

                {activeMessages.map((msg) => {
                  if (msg.senderRole === "system") {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 max-w-[90%] leading-relaxed">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isMe = msg.senderRole === userRole;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[84%] sm:max-w-[76%] px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-2xs ${
                          isMe
                            ? "bg-brand-navy-700 dark:bg-brand-teal-600 text-white rounded-tr-xs"
                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`text-[10px] mt-1 flex items-center justify-end ${
                            isMe ? "text-white/70" : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* 3. Quick Reply Pills (Matching Inspo, Dynamic, No-Emojis) */}
              {availableQuickChips.length > 0 && (
                <div className="px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 flex-shrink-0 pr-1 select-none">
                    <span>Quick</span>
                    <span className="text-brand-teal-500 font-bold">✦</span>
                  </div>
                  {availableQuickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickChip(chip)}
                      className="text-xs px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-brand-teal-500 hover:text-brand-teal-600 dark:hover:text-brand-teal-400 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* 4. Minimalist Pill Input Form with Comfortable Height */}
              <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 min-h-[48px] flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50 focus-within:border-brand-teal-500 focus-within:ring-2 focus-within:ring-brand-teal-500/20 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all">
                    <input
                      type="text"
                      placeholder={`Message ${currentBooking.tutorName.split(" ")[0]}...`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0 py-1 leading-normal"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white flex items-center justify-center disabled:opacity-40 disabled:scale-95 transition-all shadow-xs flex-shrink-0 cursor-pointer active:scale-90"
                    title="Send Message"
                    aria-label="Send Message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 text-sm">
              Select a conversation to open the direct chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-brand-teal-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
