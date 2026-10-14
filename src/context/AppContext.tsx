"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tutor, Booking, ChatMessage, UserRole, Theme, SearchFilter } from "@/types";
import { INITIAL_TUTORS, INITIAL_BOOKINGS, INITIAL_MESSAGES } from "@/data/mockData";
import { DEFAULT_SEARCH_FILTER } from "@/lib/searchFilters";

interface CurrentUserInfo {
  id: string;
  name: string;
  email: string;
  vsuId?: string;
  avatar: string;
  role: UserRole;
  department?: string;
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  currentUser: CurrentUserInfo;
  login: (email: string, password?: string, asRole?: UserRole) => boolean;
  signup: (userData: {
    name: string;
    email: string;
    password?: string;
    vsuId?: string;
    role: UserRole;
    department?: string;
  }) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  authModalMessage?: string;
  openAuthModal: (
    mode?: "login" | "signup",
    message?: string,
    onSuccess?: () => void
  ) => void;
  closeAuthModal: () => void;
  tutors: Tutor[];
  addTutor: (newTutor: Omit<Tutor, "id" | "rating" | "reviewCount" | "reviews" | "verified">) => string;
  getTutorById: (id: string) => Tutor | undefined;
  bookings: Booking[];
  createBooking: (
    bookingData: Omit<Booking, "id" | "createdAt" | "status" | "referenceNumber" | "paymentMethod"> & {
      referenceNumber?: string;
      paymentMethod?: string;
    }
  ) => string;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (bookingId: string, text: string, senderRoleOverride?: "mentee" | "tutor") => void;
  searchFilter: SearchFilter;
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
  bookingModalTutor: Tutor | null;
  openBookingModal: (tutor: Tutor) => void;
  closeBookingModal: () => void;
  resetAllData: () => void;
}

const defaultFilter = DEFAULT_SEARCH_FILTER;

const DEMO_MENTEE: CurrentUserInfo = {
  id: "mentee-1",
  name: "Angelo Reyes",
  email: "angelo.reyes@vsu.edu.ph",
  vsuId: "22-1-0492",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
  role: "mentee",
  department: "Faculty of Engineering",
};

const DEMO_TUTOR: CurrentUserInfo = {
  id: "tutor-1",
  name: "Maria Theresa Santos",
  email: "maria.santos@vsu.edu.ph",
  vsuId: "21-1-0482",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  role: "tutor",
  department: "Faculty of Management and Economics",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");
  const [role, setRoleState] = useState<UserRole>("mentee");
  const [tutors, setTutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>(defaultFilter);
  const [bookingModalTutor, setBookingModalTutor] = useState<Tutor | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Authentication & User State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CurrentUserInfo | null>(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>(undefined);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Initialize theme and stored data from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("tutorlink_theme") as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
        document.documentElement.style.colorScheme = savedTheme;
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme: Theme = prefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", prefersDark);
        document.documentElement.style.colorScheme = initialTheme;
      }

      const savedRole = localStorage.getItem("tutorlink_role") as UserRole;
      if (savedRole) setRoleState(savedRole);

      const savedAuth = localStorage.getItem("tutorlink_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      const savedUser = localStorage.getItem("tutorlink_user");
      if (savedUser) {
        try {
          setCustomUser(JSON.parse(savedUser));
        } catch {}
      }

      const savedTutors = localStorage.getItem("tutorlink_tutors");
      if (savedTutors) {
        const storedTutors: Tutor[] = JSON.parse(savedTutors);
        // Keep locally created profiles, and add new demo profiles for returning visitors.
        if (Array.isArray(storedTutors)) {
          const storedIds = new Set(storedTutors.map(tutor => tutor.id));
          setTutors([...storedTutors, ...INITIAL_TUTORS.filter(tutor => !storedIds.has(tutor.id))]);
        }
      }

      const savedBookings = localStorage.getItem("tutorlink_bookings");
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedMessages = localStorage.getItem("tutorlink_messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("tutorlink_theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    } catch (e) {
      console.error(e);
    }
  }, [theme, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("tutorlink_role", role);
  }, [role, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("tutorlink_tutors", JSON.stringify(tutors));
  }, [tutors, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("tutorlink_bookings", JSON.stringify(bookings));
  }, [bookings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("tutorlink_messages", JSON.stringify(messages));
  }, [messages, isInitialized]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    try {
      localStorage.setItem("tutorlink_theme", nextTheme);
    } catch (e) {
      console.error(e);
    }
    setTheme(nextTheme);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("tutorlink_role", newRole);
    } catch (e) {
      console.error(e);
    }
  };

  // Auth Methods
  const login = (email: string, _password?: string, asRole?: UserRole): boolean => {
    const chosenRole: UserRole = asRole || (email.toLowerCase().includes("maria") ? "tutor" : role);
    let userToSet: CurrentUserInfo;

    if (chosenRole === "tutor") {
      userToSet = DEMO_TUTOR;
    } else {
      userToSet = DEMO_MENTEE;
    }

    if (email && email !== DEMO_MENTEE.email && email !== DEMO_TUTOR.email) {
      const formattedName = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      userToSet = {
        id: `user-${Date.now()}`,
        name: formattedName || "VSU Student",
        email,
        vsuId: "23-1-0812",
        role: chosenRole,
        avatar: chosenRole === "tutor" ? DEMO_TUTOR.avatar : DEMO_MENTEE.avatar,
        department: "Faculty of Engineering",
      };
    }

    setCustomUser(userToSet);
    setRoleState(chosenRole);
    setIsAuthenticated(true);
    localStorage.setItem("tutorlink_auth", "true");
    localStorage.setItem("tutorlink_user", JSON.stringify(userToSet));
    localStorage.setItem("tutorlink_role", chosenRole);

    setIsAuthModalOpen(false);
    setAuthModalMessage(undefined);

    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      action();
    }

    return true;
  };

  const signup = (userData: {
    name: string;
    email: string;
    password?: string;
    vsuId?: string;
    role: UserRole;
    department?: string;
  }) => {
    const newUser: CurrentUserInfo = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      vsuId: userData.vsuId || "23-1-0812",
      role: userData.role,
      avatar: userData.role === "tutor" ? DEMO_TUTOR.avatar : DEMO_MENTEE.avatar,
      department: userData.department || "Faculty of Engineering",
    };

    setCustomUser(newUser);
    setRoleState(userData.role);
    setIsAuthenticated(true);
    localStorage.setItem("tutorlink_auth", "true");
    localStorage.setItem("tutorlink_user", JSON.stringify(newUser));
    localStorage.setItem("tutorlink_role", userData.role);

    setIsAuthModalOpen(false);
    setAuthModalMessage(undefined);

    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      action();
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCustomUser(null);
    localStorage.removeItem("tutorlink_auth");
    localStorage.removeItem("tutorlink_user");
  };

  const openAuthModal = (
    mode: "login" | "signup" = "login",
    message?: string,
    onSuccess?: () => void
  ) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    setPendingAuthAction(onSuccess ? () => onSuccess : null);
    if (typeof window !== "undefined") {
      window.location.href = mode === "signup" ? "/signup" : "/login";
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(undefined);
    setPendingAuthAction(null);
  };

  const currentUser: CurrentUserInfo = customUser
    ? customUser
    : role === "mentee"
    ? DEMO_MENTEE
    : DEMO_TUTOR;

  const addTutor = (
    newTutorData: Omit<Tutor, "id" | "rating" | "reviewCount" | "reviews" | "verified">
  ): string => {
    const id = `tutor-${Date.now()}`;
    const newTutor: Tutor = {
      ...newTutorData,
      id,
      rating: 5.0,
      reviewCount: 0,
      verified: true,
      reviews: [],
    };
    setTutors((prev) => [newTutor, ...prev]);
    return id;
  };

  const getTutorById = (id: string) => {
    return tutors.find((t) => t.id === id);
  };

  const createBooking = (
    bookingData: Omit<Booking, "id" | "createdAt" | "status" | "referenceNumber" | "paymentMethod"> & {
      referenceNumber?: string;
      paymentMethod?: string;
    }
  ): string => {
    const bookingId = `book-${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      referenceNumber:
        bookingData.referenceNumber ||
        `TL-VSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod:
        bookingData.paymentMethod || "In-person Cash / GCash directly to tutor",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Initialize messages for this booking
    const initialMessageList: ChatMessage[] = [
      {
        id: `msg-${Date.now()}-sys`,
        bookingId,
        senderId: "system",
        senderName: "TutorLink System",
        senderRole: "system",
        text: `Session Requested: ${bookingData.menteeName} requested a tutoring session with ${bookingData.tutorName} for ${bookingData.subject} on ${bookingData.date} (${bookingData.timeSlot}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    if (bookingData.notes) {
      initialMessageList.push({
        id: `msg-${Date.now()}-mentee`,
        bookingId,
        senderId: bookingData.menteeId,
        senderName: bookingData.menteeName,
        senderRole: "mentee",
        text: `Hi ${bookingData.tutorName}! I booked this session. Note: "${bookingData.notes}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    setMessages((prev) => ({
      ...prev,
      [bookingId]: initialMessageList,
    }));

    return bookingId;
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );

    // Add a system event to chat
    const systemNotice =
      status === "Confirmed"
        ? "Session Confirmed: The tutor accepted your booking."
        : status === "Completed"
        ? "Session Completed: Great job studying."
        : status === "Cancelled"
        ? "Session was Cancelled."
        : `Booking status changed to ${status}.`;

    const newSysMsg: ChatMessage = {
      id: `msg-${Date.now()}-sys`,
      bookingId,
      senderId: "system",
      senderName: "TutorLink System",
      senderRole: "system",
      text: systemNotice,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), newSysMsg],
    }));
  };

  const sendMessage = (
    bookingId: string,
    text: string,
    senderRoleOverride?: "mentee" | "tutor"
  ) => {
    const currentSenderRole = senderRoleOverride || (role === "tutor" ? "tutor" : "mentee");
    const senderName = currentSenderRole === "tutor" ? "Maria Theresa Santos" : currentUser.name;
    const senderId = currentSenderRole === "tutor" ? "tutor-1" : currentUser.id;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId,
      senderName,
      senderRole: currentSenderRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), newMsg],
    }));

    // If sent by mentee, simulate a realistic auto-response from the tutor after 1.5 seconds!
    if (currentSenderRole === "mentee") {
      setTimeout(() => {
        const booking = bookings.find((b) => b.id === bookingId);
        const tutorName = booking ? booking.tutorName : "Tutor";

        let replyText = "Got your message! I'm preparing our materials for the session.";
        const lower = text.toLowerCase();
        if (lower.includes("where") || lower.includes("library") || lower.includes("meet")) {
          replyText = `See you at ${booking?.locationDetail || "the VSU Main Library 2nd floor"}! I'll be wearing a green VSU lanyard.`;
        } else if (lower.includes("link") || lower.includes("online") || lower.includes("google meet")) {
          replyText = "Here is the online study link: https://meet.google.com/vsu-tutorlink-study. Let's test audio 5 mins before.";
        } else if (lower.includes("problem") || lower.includes("calc") || lower.includes("help") || lower.includes("topic")) {
          replyText = "Sounds good! Don't hesitate to take a photo of the sample problems and bring them over.";
        }

        const autoMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          bookingId,
          senderId: booking?.tutorId || "tutor-auto",
          senderName: tutorName,
          senderRole: "tutor",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => ({
          ...prev,
          [bookingId]: [...(prev[bookingId] || []), autoMsg],
        }));
      }, 1500);
    }
  };

  const openBookingModal = (tutor: Tutor) => {
    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent(`/tutors/${tutor.id}?book=true`)}&tutor=${encodeURIComponent(tutor.name)}`
      );
      return;
    }
    setBookingModalTutor(tutor);
  };

  const closeBookingModal = () => {
    setBookingModalTutor(null);
  };

  const resetAllData = () => {
    setTutors(INITIAL_TUTORS);
    setBookings(INITIAL_BOOKINGS);
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem("tutorlink_tutors");
    localStorage.removeItem("tutorlink_bookings");
    localStorage.removeItem("tutorlink_messages");
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        isAuthenticated,
        currentUser,
        login,
        signup,
        logout,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        tutors,
        addTutor,
        getTutorById,
        bookings,
        createBooking,
        updateBookingStatus,
        messages,
        sendMessage,
        searchFilter,
        setSearchFilter,
        bookingModalTutor,
        openBookingModal,
        closeBookingModal,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
