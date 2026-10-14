import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <section className="text-center">
        <Image src="/tutorlink_logo.png" alt="" width={88} height={88} className="mx-auto mb-6" priority />
        <p className="text-sm font-medium text-brand-teal-700 dark:text-brand-teal-300 mb-3">
          Peer tutoring at Visayas State University
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Find help with your next class.
        </h1>
        <p className="max-w-lg mx-auto mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Find a VSU student who can help with a subject, or share what you know
          as a peer tutor. Meet on campus or online.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link href="/find-tutor" className="px-6 py-3 rounded-lg bg-brand-navy-700 hover:bg-brand-navy-800 text-white font-semibold transition-colors">
            Find a Tutor
          </Link>
          <Link href="/become-a-tutor" className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold transition-colors">
            Become a Tutor
          </Link>
        </div>
      </section>
      <section className="mt-12 sm:mt-16 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">How it works</h2>
        <ol className="grid sm:grid-cols-3 gap-5 text-sm text-slate-600 dark:text-slate-300">
          <li><span className="block font-semibold text-slate-800 dark:text-slate-100 mb-1">1. Tell us what you need</span>Choose a subject, budget, and schedule.</li>
          <li><span className="block font-semibold text-slate-800 dark:text-slate-100 mb-1">2. Choose a tutor</span>Compare profiles and hourly rates.</li>
          <li><span className="block font-semibold text-slate-800 dark:text-slate-100 mb-1">3. Book a session</span>Arrange the details with your tutor.</li>
        </ol>
      </section>
    </div>
  );
}
