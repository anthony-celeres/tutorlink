import { SearchFilter } from "@/types";

export const DEFAULT_SEARCH_FILTER: SearchFilter = {
  subject: "", topic: "", learningStyles: [], minBudget: 0, maxBudget: 200,
  days: [], timeslots: [], deliveryMode: "All", sortBy: "match",
};

export function readSearchFilter(params: URLSearchParams, fallback = DEFAULT_SEARCH_FILTER): SearchFilter {
  if (!params.has("subject") && !params.has("course")) return fallback;
  const mode = params.get("mode");
  const budget = Number(params.get("budget"));
  return {
    ...DEFAULT_SEARCH_FILTER,
    subject: (params.get("subject") ?? params.get("course") ?? "").trim(),
    topic: params.get("topic") ?? "",
    maxBudget: params.has("budget") && Number.isFinite(budget) && budget >= 100 && budget <= 300 ? budget : 200,
    learningStyles: params.getAll("style").filter(style => ["Visual", "Discussion", "Practice / Problem Solving"].includes(style)),
    days: params.getAll("day").filter(day => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(day)),
    timeslots: params.getAll("time").filter(time => ["Morning (8:00 AM - 12:00 PM)", "Afternoon (1:00 PM - 5:00 PM)", "Evening (5:00 PM - 8:00 PM)"].includes(time)),
    deliveryMode: mode === "Online" || mode === "VSU Campus" || mode === "Both" ? mode : "All",
  };
}

export function searchFilterQuery(filter: SearchFilter): string {
  const params = new URLSearchParams({ subject: filter.subject, topic: filter.topic, budget: String(filter.maxBudget), mode: filter.deliveryMode });
  filter.learningStyles.forEach(style => params.append("style", style));
  filter.days.forEach(day => params.append("day", day));
  filter.timeslots.forEach(time => params.append("time", time));
  return params.toString();
}
