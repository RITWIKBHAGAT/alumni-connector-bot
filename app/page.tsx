"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [careerGoal, setCareerGoal] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder for future matching logic (will be implemented in next phase)
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation / Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Alumni Connector
            </span>
          </div>
          <span className="text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Phase 1: Project Scaffold
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero & Input Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Alumni Connector
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Bridge the gap between your career ambitions and experienced alumni.
            Enter your career goal to discover matching alumni mentors, learn why
            they are relevant, and get a tailored outreach message.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 text-left space-y-4">
            <div>
              <label
                htmlFor="career-goal"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                What is your career goal?
              </label>
              <textarea
                id="career-goal"
                rows={4}
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g., I want to break into management consulting or tech product management at a high-growth startup..."
                className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-base resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Find Alumni
            </button>
          </form>
        </section>

        {/* Results & Message Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Section: Alumni Matches */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Alumni Matches
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                0 matches found
              </span>
            </div>

            {/* Placeholder state */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[220px]">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-700">
                No Alumni Displayed Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Enter your career goal above and click &quot;Find Alumni&quot; to discover
                relevant alumni mentors and their background details.
              </p>
            </div>
          </section>

          {/* Section: Generated Outreach Message */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Personalized Outreach Message
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Draft template
              </span>
            </div>

            {/* Placeholder state */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[220px]">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-700">
                Outreach Message Preview
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Once an alumnus is selected, a personalized and polite
                introductory note will be generated here for you to review and copy.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          Alumni Connector &bull; Initial Project Scaffold
        </div>
      </footer>
    </div>
  );
}
