"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import CareerFieldSelector from "./CareerFieldSelector";

interface GoalInputProps {
  careerGoal: string;
  setCareerGoal: (goal: string) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function GoalInput({
  careerGoal,
  setCareerGoal,
  selectedField,
  setSelectedField,
  onSearch,
  isLoading,
}: GoalInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((!careerGoal.trim() && selectedField === "All Fields") || isLoading) return;
    onSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if ((careerGoal.trim() || selectedField !== "All Fields") && !isLoading) {
        onSearch();
      }
    }
  };

  return (
    <section className="max-w-4xl mx-auto w-full space-y-8">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className={`relative rounded-2xl glass-panel transition-all duration-300 ${
            isFocused
              ? "border-cyan-500/50 shadow-[0_0_35px_-8px_rgba(56,189,248,0.25)] bg-[#0C111E]"
              : "border-white/[0.08] hover:border-white/[0.14]"
          }`}
        >
          {/* Top Field Category Selector inside the input panel */}
          <div className="p-4 sm:p-6 pb-2 sm:pb-3 border-b border-white/[0.06]">
            <CareerFieldSelector
              selectedField={selectedField}
              onSelectField={setSelectedField}
            />
          </div>

          {/* Text Area for Free-Form Career Goal */}
          <div className="p-4 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="goal-textarea"
                className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2"
              >
                <span className="text-cyan-400">01 //</span>
                <span>What are you trying to become?</span>
              </label>

              {careerGoal.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCareerGoal("")}
                  className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  [clear input]
                </button>
              )}
            </div>

            <textarea
              id="goal-textarea"
              rows={3}
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., I want to break into management consulting or tech strategy, learn how to ace case interviews, and prepare for partner round interviews..."
              className="w-full text-slate-100 placeholder:text-slate-500 bg-transparent text-sm sm:text-base leading-relaxed resize-none focus:outline-none font-sans"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-black/20 border-t border-white/[0.06] rounded-b-2xl">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="hidden sm:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                  ⌘ / Ctrl
                </kbd>
                +
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                  Enter
                </kbd>
                <span className="text-slate-500 text-[11px] ml-1">to execute</span>
              </span>
              <span className="hidden sm:inline text-slate-700">|</span>
              <span className="text-[11px] text-slate-500">
                {careerGoal.trim().length} chars entered
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!careerGoal.trim() && selectedField === "All Fields")}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 ${
                isLoading || (!careerGoal.trim() && selectedField === "All Fields")
                  ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_20px_-3px_rgba(56,189,248,0.4)] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-cyan-400"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Querying Network...</span>
                </>
              ) : (
                <>
                  <span>Find Alumni</span>
                  <svg
                    className="w-4 h-4 text-cyan-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
