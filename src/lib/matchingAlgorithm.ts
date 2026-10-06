import { Tutor, SearchFilter } from "@/types";

export function calculateMatchScore(tutor: Tutor, filter: SearchFilter): number {
  let score = 50; // base score

  // 1. Subject match (up to +30 points)
  if (filter.subject && filter.subject.trim() !== "") {
    const filterSub = filter.subject.toLowerCase();
    const hasExactPrimary = tutor.primarySubject.toLowerCase().includes(filterSub);
    const hasSubject = tutor.subjectsMastered.some((s) => s.toLowerCase().includes(filterSub));

    if (hasExactPrimary) {
      score += 30;
    } else if (hasSubject) {
      score += 25;
    } else {
      score -= 20; // doesn't teach subject
    }
  } else {
    // If no subject specified, award neutral
    score += 15;
  }

  // 2. Specific topic match (up to +15 points)
  if (filter.topic && filter.topic.trim() !== "") {
    const topicLower = filter.topic.toLowerCase();
    const matchesBio = tutor.bio.toLowerCase().includes(topicLower);
    const matchesSubjects = tutor.subjectsMastered.some((s) => s.toLowerCase().includes(topicLower));
    if (matchesBio || matchesSubjects) {
      score += 15;
    }
  }

  // 3. Learning style match (up to +15 points)
  if (filter.learningStyles && filter.learningStyles.length > 0) {
    const overlap = filter.learningStyles.filter((style) =>
      tutor.learningStyles.includes(style as any)
    );
    if (overlap.length > 0) {
      score += Math.min(15, overlap.length * 8);
    }
  } else {
    score += 10;
  }

  // 4. Budget compatibility (up to +20 points)
  if (tutor.hourlyRate <= filter.maxBudget && tutor.hourlyRate >= filter.minBudget) {
    score += 20;
  } else if (tutor.hourlyRate > filter.maxBudget) {
    const diff = tutor.hourlyRate - filter.maxBudget;
    if (diff <= 50) score += 5;
    else score -= 15;
  } else {
    score += 10;
  }

  // 5. Schedule overlap (up to +15 points)
  if (filter.days && filter.days.length > 0) {
    const dayOverlap = filter.days.filter((d) => tutor.availabilityDays.includes(d));
    if (dayOverlap.length > 0) {
      score += Math.min(15, dayOverlap.length * 5);
    }
  } else {
    score += 10;
  }

  // 6. Delivery mode / location match (up to +10 points)
  if (filter.deliveryMode && filter.deliveryMode !== "All") {
    if (filter.deliveryMode === "Both") {
      if (tutor.deliveryModes.length >= 2) score += 10;
    } else if (tutor.deliveryModes.includes(filter.deliveryMode as any)) {
      score += 10;
    } else {
      score -= 10;
    }
  } else {
    score += 10;
  }

  // Normalize between 65% and 99%
  const finalScore = Math.max(65, Math.min(99, Math.round(score)));
  return finalScore;
}
