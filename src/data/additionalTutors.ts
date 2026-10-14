import { Tutor } from "@/types";

const morning = "Morning (8:00 AM - 12:00 PM)";
const afternoon = "Afternoon (1:00 PM - 5:00 PM)";
const evening = "Evening (5:00 PM - 8:00 PM)";

type DemoProfile = Pick<Tutor, "id" | "name" | "degree" | "primarySubject" | "subjectsMastered" |
  "learningStyles" | "bio" | "hourlyRate" | "deliveryModes" | "availabilityDays" | "timeslots">;

function demoTutor(profile: DemoProfile): Tutor {
  return {
    ...profile,
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80",
    email: `${profile.id}@example.invalid`,
    vsuId: `DEMO-${profile.id.split("-")[1]}`,
    yearLevel: "3rd Year",
    department: profile.degree.includes("Agribusiness") ? "Faculty of Management and Economics" : "Faculty of Arts and Sciences",
    qualifications: ["Fictional profile for prototype testing."],
    tutoringExperience: "Sample peer tutor profile; availability is for demonstration only.",
    campusLocations: profile.deliveryModes.includes("VSU Campus") ? ["VSU Main Library (1st Floor Collaborative Area)"] : [],
    rating: 0,
    reviewCount: 0,
    verified: false,
    reviews: [],
  };
}

// Fictional examples, including several alternatives for Agribusiness searches.
export const ADDITIONAL_TUTORS: Tutor[] = ([
  {
    id: "tutor-9", name: "Lea Mendoza", degree: "BS in Agribusiness",
    primarySubject: "Microeconomics",
    subjectsMastered: ["Microeconomics", "Agricultural Economics", "Farm Management"],
    learningStyles: ["Visual", "Discussion"],
    bio: "I use diagrams to explain supply and demand, price elasticity, farm costs, and market structures.",
    hourlyRate: 220, deliveryModes: ["Online", "VSU Campus"],
    availabilityDays: ["Mon", "Wed", "Fri"], timeslots: [afternoon, evening],
  },
  {
    id: "tutor-10", name: "Carlo Villanueva", degree: "BS in Agribusiness",
    primarySubject: "Agricultural Economics",
    subjectsMastered: ["Agricultural Economics", "Microeconomics", "Farm Management"],
    learningStyles: ["Practice / Problem Solving", "Discussion"],
    bio: "We work through farm budgets, supply and demand, opportunity costs, and break-even calculations using small farm examples.",
    hourlyRate: 140, deliveryModes: ["Online"],
    availabilityDays: ["Sat", "Sun"], timeslots: [morning, afternoon],
  },
  {
    id: "tutor-11", name: "Rina Torres", degree: "BS in Agribusiness",
    primarySubject: "Agricultural Marketing",
    subjectsMastered: ["Agricultural Marketing", "Agricultural Economics", "Microeconomics"],
    learningStyles: ["Visual", "Discussion"],
    bio: "I explain supply chains, pricing, consumer demand, and marketing plans with examples from local produce markets.",
    hourlyRate: 180, deliveryModes: ["VSU Campus"],
    availabilityDays: ["Tue", "Thu", "Fri"], timeslots: [afternoon],
  },
  {
    id: "tutor-12", name: "Paolo Ramos", degree: "BS in Economics",
    primarySubject: "Agricultural Economics",
    subjectsMastered: ["Agricultural Economics", "Microeconomics", "Macroeconomics"],
    learningStyles: ["Practice / Problem Solving", "Visual"],
    bio: "I focus on elasticity, marginal costs, agricultural policy, inflation, and how to solve economic model exercises.",
    hourlyRate: 240, deliveryModes: ["Online"],
    availabilityDays: ["Mon", "Tue", "Wed", "Thu"], timeslots: [evening],
  },
  {
    id: "tutor-13", name: "Mika Bautista", degree: "BS in Agribusiness",
    primarySubject: "Farm Management",
    subjectsMastered: ["Farm Management", "Agricultural Economics", "Financial Accounting"],
    learningStyles: ["Practice / Problem Solving"],
    bio: "I help with enterprise budgeting, farm records, cash flow, and choosing between production plans.",
    hourlyRate: 120, deliveryModes: ["VSU Campus"],
    availabilityDays: ["Sat", "Sun"], timeslots: [morning],
  },
  {
    id: "tutor-14", name: "Nico Castillo", degree: "BS in Agribusiness",
    primarySubject: "Financial Accounting",
    subjectsMastered: ["Financial Accounting", "Cost Accounting", "Farm Management"],
    learningStyles: ["Practice / Problem Solving", "Visual"],
    bio: "We practice journal entries, financial statements, cost allocation, farm budgets, and break-even analysis.",
    hourlyRate: 190, deliveryModes: ["Online", "VSU Campus"],
    availabilityDays: ["Fri", "Sat", "Sun"], timeslots: [afternoon, evening],
  },
  {
    id: "tutor-15", name: "Diane Flores", degree: "BS in Agribusiness",
    primarySubject: "Agricultural Marketing",
    subjectsMastered: ["Agricultural Marketing", "Entrepreneurship", "Business Mathematics"],
    learningStyles: ["Discussion", "Visual"],
    bio: "I help students outline marketing plans, identify customer segments, and calculate markups and sales margins.",
    hourlyRate: 160, deliveryModes: ["Online"],
    availabilityDays: ["Tue", "Thu", "Sat"], timeslots: [afternoon],
  },
  {
    id: "tutor-16", name: "Luis Navarro", degree: "BS in Agribusiness",
    primarySubject: "Entrepreneurship",
    subjectsMastered: ["Entrepreneurship", "Farm Management", "Agricultural Marketing"],
    learningStyles: ["Discussion", "Practice / Problem Solving"],
    bio: "We turn business ideas into simple plans and discuss farm enterprises, startup costs, and customer research.",
    hourlyRate: 100, deliveryModes: ["Online", "VSU Campus"],
    availabilityDays: ["Mon", "Wed", "Sun"], timeslots: [morning],
  },
  {
    id: "tutor-17", name: "Camille Perez", degree: "BS in Applied Mathematics",
    primarySubject: "Stat 1 (Elementary Statistics)",
    subjectsMastered: ["Stat 1 (Elementary Statistics)", "Stat 101 (Probability & Inference)", "Business Statistics"],
    learningStyles: ["Visual", "Practice / Problem Solving"],
    bio: "I use charts and sample datasets to explain averages, probability, hypothesis testing, and regression for business decisions.",
    hourlyRate: 210, deliveryModes: ["Online"],
    availabilityDays: ["Sat", "Sun"], timeslots: [afternoon],
  },
  {
    id: "tutor-18", name: "Andre Salazar", degree: "BS in Applied Mathematics",
    primarySubject: "Math 11 (College Algebra)",
    subjectsMastered: ["Math 11 (College Algebra)", "Business Mathematics"],
    learningStyles: ["Practice / Problem Solving", "Discussion"],
    bio: "I walk through equations, functions, percentages, interest, and business arithmetic one exercise at a time.",
    hourlyRate: 150, deliveryModes: ["VSU Campus"],
    availabilityDays: ["Mon", "Tue", "Thu", "Fri"], timeslots: [morning],
  },
  {
    id: "tutor-19", name: "Trisha Aquino", degree: "BS in Computer Science",
    primarySubject: "CMSC 11 (Intro to Programming)",
    subjectsMastered: ["CMSC 11 (Intro to Programming)", "CMSC 21 (Data Structures)"],
    learningStyles: ["Practice / Problem Solving", "Discussion"],
    bio: "We write small programs and debug loops, arrays, functions, and basic data structures together.",
    hourlyRate: 230, deliveryModes: ["Online"],
    availabilityDays: ["Fri", "Sat", "Sun"], timeslots: [evening],
  },
  {
    id: "tutor-20", name: "Sofia Cruz", degree: "BS in Development Communication",
    primarySubject: "Technical Writing & Comm 10",
    subjectsMastered: ["Technical Writing & Comm 10", "Entrepreneurship"],
    learningStyles: ["Discussion", "Practice / Problem Solving"],
    bio: "I help with clear business proposals, report structure, presentations, and revising written arguments.",
    hourlyRate: 130, deliveryModes: ["Online", "VSU Campus"],
    availabilityDays: ["Wed", "Sat", "Sun"], timeslots: [afternoon, evening],
  },
] satisfies DemoProfile[]).map(demoTutor);
