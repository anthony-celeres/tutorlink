export interface TutorReview {
  id: string;
  authorName: string;
  course: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  email: string;
  vsuId: string;
  degree: string;
  yearLevel: string;
  department: string;
  subjectsMastered: string[];
  primarySubject: string;
  learningStyles: ("Visual" | "Discussion" | "Practice / Problem Solving")[];
  bio: string;
  qualifications: string[];
  tutoringExperience: string;
  hourlyRate: number; // in PHP
  deliveryModes: ("Online" | "VSU Campus")[];
  campusLocations: string[];
  availabilityDays: string[];
  timeslots: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  reviews: TutorReview[];
  matchScore?: number;
}

export interface SearchFilter {
  subject: string;
  topic: string;
  learningStyles: string[];
  minBudget: number;
  maxBudget: number;
  days: string[];
  timeslots: string[];
  deliveryMode: "All" | "VSU Campus" | "Online" | "Both";
  sortBy?: "match" | "rating" | "price_asc" | "price_desc" | "reviews";
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  menteeId: string;
  menteeName: string;
  menteeEmail: string;
  subject: string;
  topic: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  locationMode: "VSU Campus" | "Online";
  locationDetail: string;
  meetingLink?: string;
  learningStyle: string;
  notes: string;
  hourlyRate: number;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  referenceNumber: string;
  paymentMethod: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: "mentee" | "tutor" | "system";
  text: string;
  timestamp: string;
  isQuickAction?: boolean;
}

export type UserRole = "mentee" | "tutor" | "admin";
export type Theme = "light" | "dark";
