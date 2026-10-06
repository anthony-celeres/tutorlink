# TutorLink Platform Specifications & User Flow

**Target Institution:** Visayas State University (VSU)  
**Document Version:** 2.0  
**Status:** Approved for Implementation  

---

### 1. Landing Page

* **Branding:** TutorLink Logo & Wordmark
* **Tagline / Description:** *A centralized mentor–mentee matching platform designed for Visayas State University (VSU) students.*
* **Primary Call-to-Action (CTA) Buttons:**
  * `[Find a Tutor]` (Student/Mentee Entry Point)
  * `[Become a Tutor]` (Peer Tutor Entry Point)

---

### 2. "Find a Tutor" Request Form

*Triggered when a user clicks the **Find a Tutor** button.*

* **Course Code / Subject Name:** (e.g., `Microeconomics`, `Chem 11`, `Math 21`)
* **Specific Topic / Focus Area:** (e.g., `Supply and Demand`, `Stoichiometry`, `Differential Calculus`)
* **Preferred Learning Style:**
  * [ ] Visual (diagrams, mind maps, slides)
  * [ ] Discussion / Concept-driven
  * [ ] Practice-heavy (problem sets, sample exams)
* **Budget Range:** (e.g., `₱100 – ₱300 / hour` or a custom slider)
* **Preferred Days & Times:** (e.g., `Monday–Friday, 4:00 PM – 7:00 PM`)
* **Session Mode / Location:**
  * [ ] Online (Google Meet, Zoom, Discord)
  * [ ] On-Campus (VSU Library, Department Study Sheds, Eco-Park)
* **Action Button:** `[Find My Tutor]`

---

### 3. "Become a Tutor" Onboarding Form

*Triggered when a student clicks the **Become a Tutor** button.*

* **Personal Details:** Full Name, Student ID / VSU Email, Profile Photo
* **Academic Profile:** Degree Program & Year Level (e.g., `BS Agriculture – 3rd Year`)
* **Areas of Expertise:** List of subjects passed with high marks (grade upload/proof optional)
* **Qualifications & Achievements:** Honor standing (Dean’s Lister), academic awards, or club affiliations
* **Tutoring Experience:** Prior peer tutoring, group study moderation, or informal mentoring
* **Weekly Availability:** Dynamic calendar selector (days and available time slots)
* **Preferred Session Venue:** In-person (on-campus), remote/online, or hybrid
* **Standard Hourly Rate:** Expected fee (e.g., `₱150/hour`)
* **Short Bio / Teaching Philosophy:** 1–2 sentences explaining their approach
* **Action Button:** `[Submit Tutor Application]`

---

### 4. Matching & Search Results Screen

*Displayed after submitting the "Find a Tutor" form. Displays tutor cards sorted by highest match score.*

#### Example Tutor Card:

```text
┌────────────────────────────────────────────────────────┐
│ [Photo]  Maria Santos                                  │
│          BS Agriculture – 3rd Year                     │
│                                                        │
│ ⭐ 4.8 / 5.0 (24 reviews)        🎯 95% Match Score    │
│ 📚 Microeconomics, Macroeconomics                      │
│ 🕒 Available: Mon–Fri, 4:00 PM – 7:00 PM               │
│ 📍 VSU Campus (Library) / Online                       │
│ 💵 ₱150 / hour                                         │
│                                                        │
│ [View Full Profile]           [Book a Session]         │
└────────────────────────────────────────────────────────┘
```

---

### 5. Booking Confirmation Modal

*Appears after clicking **Book a Session**.*

* **Tutor:** Maria Santos
* **Subject & Topic:** Microeconomics — *Supply and Demand*
* **Selected Date:** Wednesday, October 7, 2026
* **Session Time:** 4:30 PM – 5:30 PM (1 hour)
* **Venue:** VSU University Library (Discussion Room 2) or Google Meet link
* **Total Fee:** ₱150.00
* **Payment Method:** In-person Cash / GCash directly to tutor
* **Action Button:** `[Confirm Booking]`

---

### 6. Post-Booking & Direct Messaging

* **Confirmation Screen:** Displays booking reference number (e.g., `TL-VSU-2026-8942`), session guidelines, and calendar sync (Google Calendar / iCal).
* **Built-in Chat:** Unlocks a direct message window between tutor and mentee to exchange learning materials, discuss exact campus meeting spots, or share video conference links.