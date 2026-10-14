"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SearchFilter } from "@/types";
import { readSearchFilter, searchFilterQuery } from "@/lib/searchFilters";
import { VSU_SUBJECTS } from "@/data/mockData";

const dayOptions = {
  "Any day": [],
  "Monday–Friday": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "Weekends": ["Sat", "Sun"],
};
const learningOptions = [
  { value: "Visual", label: "Visual — diagrams and slides" },
  { value: "Discussion", label: "Discussion — explanations and questions" },
  { value: "Practice / Problem Solving", label: "Practice — exercises and problem sets" },
];
const inputClass = "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base text-slate-900 dark:text-white";
const labelClass = "block mb-2 text-sm font-medium text-slate-800 dark:text-slate-200";

function FindTutorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchFilter, setSearchFilter } = useApp();
  const [initialFilter] = useState(() => readSearchFilter(new URLSearchParams(searchParams.toString()), searchFilter));
  const [subject, setSubject] = useState(initialFilter.subject);
  const [topic, setTopic] = useState(initialFilter.topic);
  const [learningStyles, setLearningStyles] = useState<string[]>(initialFilter.learningStyles);
  const [budget, setBudget] = useState(initialFilter.maxBudget);
  const [days, setDays] = useState<keyof typeof dayOptions>(() =>
    (Object.keys(dayOptions) as (keyof typeof dayOptions)[]).find(key =>
      dayOptions[key].length === initialFilter.days.length && dayOptions[key].every(day => initialFilter.days.includes(day))) ?? "Any day");
  const [time, setTime] = useState(initialFilter.timeslots[0] ?? "");
  const [mode, setMode] = useState<SearchFilter["deliveryMode"]>(initialFilter.deliveryMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const filter: SearchFilter = {
      subject: subject.trim(),
      topic: topic.trim(),
      learningStyles,
      minBudget: 0,
      maxBudget: budget,
      days: dayOptions[days],
      timeslots: time ? [time] : [],
      deliveryMode: mode,
      sortBy: "match",
    };
    setSearchFilter(filter);
    router.push("/results?" + searchFilterQuery(filter));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Find a Tutor</h1>
      <p className="mt-2 mb-6 text-sm text-slate-600 dark:text-slate-300">
        Tell us what you need help with. You can compare tutors before booking.
      </p>
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-6">
        <div>
          <label htmlFor="subject" className={labelClass}>Course code or subject <span className="text-slate-500">(required)</span></label>
          <input id="subject" name="subject" type="text" list="demo-subjects" required pattern=".*\S.*" title="Enter a course code or subject." maxLength={100} value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="e.g. Microeconomics" className={inputClass} />
          <datalist id="demo-subjects">
            {VSU_SUBJECTS.map(subject => <option key={subject} value={subject} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="topic" className={labelClass}>Topic <span className="text-slate-500">(optional)</span></label>
          <input id="topic" name="topic" type="text" maxLength={200} value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Supply and demand" className={inputClass} />
        </div>
        <fieldset>
          <legend className={labelClass}>Preferred learning style <span className="text-slate-500">(optional)</span></legend>
          <div className="space-y-3">
            {learningOptions.map(({ value, label }) => (
              <label key={value} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" name="learningStyle" value={value} checked={learningStyles.includes(value)}
                  onChange={(event) => setLearningStyles((previous) => event.target.checked
                    ? [...previous, value] : previous.filter((style) => style !== value))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-navy-700" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="budget" className={labelClass}>Maximum hourly budget (₱)</label>
          <input id="budget" name="budget" type="number" min={100} max={300} step={10} required
            value={budget} onChange={(event) => setBudget(Number(event.target.value))} className={inputClass}
            aria-describedby="budget-help" />
          <p id="budget-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">₱100–₱300 per hour.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="days" className={labelClass}>Preferred days</label>
            <select id="days" name="days" value={days} onChange={(event) => setDays(event.target.value as keyof typeof dayOptions)} className={inputClass}>
              {Object.keys(dayOptions).map((day) => <option key={day}>{day}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>Preferred time</label>
            <select id="time" name="time" value={time} onChange={(event) => setTime(event.target.value)} className={inputClass}>
              <option value="">Any time</option>
              <option>Morning (8:00 AM - 12:00 PM)</option>
              <option>Afternoon (1:00 PM - 5:00 PM)</option>
              <option>Evening (5:00 PM - 8:00 PM)</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="mode" className={labelClass}>Session mode</label>
          <select id="mode" name="mode" value={mode} onChange={(event) => setMode(event.target.value as SearchFilter["deliveryMode"])} className={inputClass}>
            <option value="All">Campus or online</option>
            <option value="VSU Campus">On campus</option>
            <option value="Online">Online</option>
            <option value="Both">Both campus and online</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-semibold disabled:opacity-60 disabled:cursor-wait">
          {isSubmitting ? "Finding tutors…" : "Find My Tutor"}
        </button>
      </form>
    </div>
  );
}

export default function FindTutorPage() {
  return (
    <Suspense fallback={<p role="status" className="p-8 text-center">Loading tutor form…</p>}>
      <FindTutorForm />
    </Suspense>
  );
}
