import { Tutor, SearchFilter } from "@/types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ")
    .replace(/([a-z])\s+(\d)/g, "$1$2").trim();
}

function teaches(subject: string, query: string): boolean {
  // Whole phrases allow course codes and titles, without Math 2 matching Math 21.
  return (` ${normalize(subject)} `).includes(` ${normalize(query)} `);
}

function overlaps(requested: string[], available: string[]): boolean {
  return requested.length === 0 || requested.some(value => available.includes(value));
}

function timeRange(value: string): number[] | null {
  const times = [...value.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  if (times.length !== 2) return null;
  const minutes = times.map(([, hours, mins = "0", period]) => {
    const hour = Number(hours);
    const minute = Number(mins);
    if (hour < 1 || hour > 12 || minute > 59) return NaN;
    return (hour % 12 + (period.toUpperCase() === "PM" ? 12 : 0)) * 60 + minute;
  });
  return minutes.every(Number.isFinite) && minutes[0] < minutes[1] ? minutes : null;
}

function timesOverlap(requested: string, available: string): boolean {
  const wanted = timeRange(requested);
  const offered = timeRange(available);
  if (!wanted || !offered) return normalize(requested) === normalize(available);
  return wanted[0] < offered[1] && offered[0] < wanted[1];
}

export function calculateMatchScore(tutor: Tutor, filter: SearchFilter): number {
  const subject = normalize(filter.subject);
  if (!subject || ![tutor.primarySubject, ...tutor.subjectsMastered].some(s => teaches(s, subject))) return 0;
  if (!Number.isFinite(filter.maxBudget) || tutor.hourlyRate > filter.maxBudget) return 0;
  if (filter.deliveryMode === "Both" && !["Online", "VSU Campus"].every(mode => tutor.deliveryModes.some(m => m === mode))) return 0;
  if (filter.deliveryMode !== "All" && filter.deliveryMode !== "Both" && !tutor.deliveryModes.includes(filter.deliveryMode)) return 0;
  if (!overlaps(filter.days, tutor.availabilityDays)) return 0;
  if (filter.timeslots.length && !filter.timeslots.some(time => tutor.timeslots.some(slot => timesOverlap(time, slot)))) return 0;

  // The score describes preference fit, not a prediction of academic performance.
  let weight = 60;
  let score = teaches(tutor.primarySubject, subject) ? 60 : 51;
  if (filter.learningStyles.length) {
    weight += 20;
    score += 20 * filter.learningStyles.filter(style => tutor.learningStyles.some(s => s === style)).length / filter.learningStyles.length;
  }
  const topicWords = [...new Set(normalize(filter.topic).split(" ").filter(word => word && !["a", "an", "the", "and", "of", "to", "in"].includes(word)))];
  if (topicWords.length) {
    const description = ` ${normalize([tutor.bio, ...tutor.subjectsMastered].join(" "))} `;
    weight += 15;
    score += 15 * topicWords.filter(word => description.includes(` ${word} `)).length / topicWords.length;
  }
  if (filter.days.length) {
    weight += 5;
    score += 5 * filter.days.filter(day => tutor.availabilityDays.includes(day)).length / filter.days.length;
  }
  return Math.round(100 * score / weight);
}

export function rankTutors(tutors: Tutor[], filter: SearchFilter): Tutor[] {
  return tutors.map(tutor => ({ ...tutor, matchScore: calculateMatchScore(tutor, filter) }))
    .filter(tutor => tutor.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || a.hourlyRate - b.hourlyRate || b.rating - a.rating || a.name.localeCompare(b.name));
}
