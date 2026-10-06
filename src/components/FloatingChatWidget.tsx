"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Booking } from "@/types";
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  ChevronDown,
  MapPin,
  Clock,
  Info,
} from "lucide-react";

const INITIAL_QUICK_CHIPS = [
  "Where are you located?",
  "At VSU Library",
  "On my way",
  "Ready for session",
  "Can you share the syllabus?",
  "Need to reschedule",
];

export const FloatingChatWidget: React.FC = () => {
  const pathname = usePathname();
  const { bookings, messages, sendMessage, role, isAuthenticated, openAuthModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings[0]?.id ?? ""
  );
  const userRole: "mentee" | "tutor" = role === "tutor" ? "tutor" : "mentee";
  const [inputMessage, setInputMessage] = useState("");
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // Keep selected booking valid
  useEffect(() => {
    if (bookings.length > 0 && (!selectedBookingId || !bookings.some((b) => b.id === selectedBookingId))) {
      setSelectedBookingId(bookings[0].id);
    }
  }, [bookings, selectedBookingId]);

  const currentBooking: Booking | undefined = useMemo(() => {
    return bookings.find((b) => b.id === selectedBookingId) || bookings[0];
  }, [bookings, selectedBookingId]);

  const activeMessages = useMemo(() => {
    return selectedBookingId ? messages[selectedBookingId] || [] : [];
  }, [selectedBookingId, messages]);

  // Determine user messages vs initial state
  const userMessages = useMemo(() => {
    return activeMessages.filter((m) => m.senderRole !== "system");
  }, [activeMessages]);

  // Filter out chips that have already been sent in this session
  const availableChips = useMemo(() => {
    const sentTexts = new Set(
      activeMessages.map((m) => m.text.trim().toLowerCase())
    );
    return INITIAL_QUICK_CHIPS.filter(
      (chip) => !sentTexts.has(chip.trim().toLowerCase())
    );
  }, [activeMessages]);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, isOpen]);

  // Close session picker on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setShowSessionPicker(false);
      }
    };
    if (showSessionPicker) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSessionPicker]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedBookingId) return;

    const textToSend = inputMessage.trim();
    sendMessage(selectedBookingId, textToSend, userRole);
    setInputMessage("");

    // Simulate tutor reply if sent as mentee
    if (userRole === "mentee" && currentBooking) {
      setTimeout(() => {
        const simulatedReplies = [
          "Got it! Looking forward to our session.",
          "Noted! See you at our scheduled venue.",
          "Sounds good! Bring any specific questions you have.",
          "I'm on campus and ready!",
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
        let reply = "Got it! See you at our scheduled session.";
        if (text.includes("located")) {
          reply = `I'm at ${currentBooking.locationDetail}. Looking forward to our session!`;
        } else if (text.includes("Library")) {
          reply = "Great, I've got a study table ready with our course reference materials.";
        } else if (text.includes("way")) {
          reply = "Take your time! I'll be waiting here.";
        } else if (text.includes("Ready")) {
          reply = "Awesome! Let's dive straight into the problem sets and key concepts.";
        } else if (text.includes("syllabus")) {
          reply = "Yes, I have the course outline and practice exercises prepared.";
        } else if (text.includes("reschedule")) {
          reply = "No problem! Let me know what time slot works best for you.";
        }
        sendMessage(selectedBookingId, reply, "tutor");
      }, 800);
    }
  };

  // If already on full chat page, don't show floating widget
  if (pathname === "/chat" || pathname.startsWith("/chat/")) {
    return null;
  }

  const peerName = currentBooking ? currentBooking.tutorName : "VSU Peer Tutor";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Widget Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 select-none">
        {/* Chat Sheet / Modal Window */}
        {isOpen && (
          <div
            ref={widgetRef}
            className="fixed inset-x-0 bottom-0 sm:bottom-20 sm:right-6 sm:left-auto sm:inset-x-auto w-full sm:w-[380px] h-[88vh] sm:h-[540px] max-h-[92vh] sm:max-h-[82vh] bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom duration-300 ring-1 ring-black/5 dark:ring-white/10"
          >
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden flex-shrink-0" />

            {/* 1. Header (Clean Minimalist Design matching inspo) */}
            <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight truncate">
                    {peerName}
                  </h3>
                  <span className="text-brand-teal-500 font-bold text-sm">✦</span>
                </div>
                
                {currentBooking ? (
                  <button
                    type="button"
                    onClick={() => setShowSessionPicker((prev) => !prev)}
                    className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mt-0.5 cursor-pointer"
                  >
                    <span>Ready • {currentBooking.subject}</span>
                    {bookings.length > 1 && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          showSessionPicker ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ready</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                {currentBooking && (
                  <button
                    type="button"
                    onClick={() => setShowSessionDetails((prev) => !prev)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      showSessionDetails
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                    title="Session Details"
                    aria-label="Session Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                )}
                <Link
                  href={`/chat${selectedBookingId ? `?id=${selectedBookingId}` : ""}`}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Open Full Screen Chat"
                  aria-label="Open Full Screen Chat"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Session Switcher Popover */}
              {showSessionPicker && bookings.length > 1 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl z-30 p-2 space-y-1 animate-in fade-in duration-150">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Session ({bookings.length})
                  </p>
                  {bookings.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(b.id);
                        setShowSessionPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                        b.id === selectedBookingId
                          ? "bg-brand-navy-50 text-brand-navy-700 dark:bg-slate-800 dark:text-brand-teal-300 font-bold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="truncate font-semibold">{b.subject}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {b.tutorName} • {b.date}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Collapsible Session Details */}
            {showSessionDetails && currentBooking && (
              <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200/70 dark:border-slate-800 px-5 py-2.5 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-150 flex-shrink-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {currentBooking.subject} ({currentBooking.topic})
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentBooking.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {currentBooking.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-brand-teal-500 flex-shrink-0" />
                    <span className="truncate">{currentBooking.locationDetail}</span>
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3 text-brand-teal-500 flex-shrink-0" />
                    <span>{currentBooking.timeSlot}</span>
                  </span>
                </div>
              </div>
            )}

            {/* 2. Message Stream & Inline Quick Responses (Exact Inspo Flow) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 bg-slate-50/50 dark:bg-[#0b121e]">
              {/* Subtle Session Venue Pill */}
              {currentBooking && (
                <div className="flex justify-center my-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-brand-teal-500 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{currentBooking.locationDetail}</span>
                    <span>•</span>
                    <span>{currentBooking.timeSlot}</span>
                  </div>
                </div>
              )}

              {/* Initial State Quick Responses (matches inspo image 2 & 3 before or at start of messages) */}
              {userMessages.length === 0 && availableChips.length > 0 && (
                <div className="py-2 space-y-3">
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                    <span>Ask about your peer session</span>
                    <span className="text-brand-teal-500 text-xs">✦</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickChip(chip)}
                        className="text-xs sm:text-[13px] px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100 font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation Messages */}
              {activeMessages.map((msg) => {
                const isMe = msg.senderRole === userRole;
                const isSystem = msg.senderRole === "system";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="max-w-[90%] text-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] border border-slate-200/50 dark:border-slate-700/50 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-brand-navy-700 text-white rounded-tr-xs"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/70 dark:border-slate-700/70"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          isMe ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Follow-up Quick Responses: "YOU MIGHT ALSO ASK" (matches inspo image 4 after messages are exchanged) */}
              {userMessages.length > 0 && availableChips.length > 0 && (
                <div className="pt-2 pb-1 space-y-2 animate-in fade-in duration-200">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    You might also ask
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableChips.slice(0, 3).map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickChip(chip)}
                        className="text-xs sm:text-[13px] px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100 font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Bottom Input Bar & Disclaimer (exact match to reference screenshot) */}
            <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask about ${currentBooking?.subject || "session"}...`}
                  className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 min-h-[48px] text-sm sm:text-base outline-none focus:outline-none focus:border-brand-teal-500 focus:ring-2 focus:ring-brand-teal-500/20 transition-all leading-normal"
                />
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
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1 text-left leading-normal">
                Messages are coordinated directly with your VSU peer mentor. Nothing else is stored.
              </p>
            </div>
          </div>
        )}

        {/* Floating Trigger Button (Bottom Right) */}
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal(
                "login",
                "Please log in to access your sessions and chat.",
                () => setIsOpen(true)
              );
              return;
            }
            setIsOpen((prev) => !prev);
          }}
          aria-label="Toggle Sessions and Chat"
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl transition-all duration-300 active:scale-95 cursor-pointer select-none ${
            isOpen
              ? "bg-slate-900 dark:bg-slate-800 ring-2 ring-brand-teal-500/40 shadow-slate-900/30"
              : "bg-gradient-to-r from-brand-navy-700 via-brand-navy-800 to-brand-teal-600 hover:from-brand-navy-800 hover:to-brand-teal-700 shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/35 hover:-translate-y-0.5"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <span className="font-extrabold text-xs tracking-wide">
            {isOpen ? "Close Chat" : "Sessions & Chat"}
          </span>

          {/* Pending Badge */}
          {!isOpen && pendingCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white shadow-xs">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
