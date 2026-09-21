"use client";

import { useState } from "react";
import GoalInput from "@/components/GoalInput";
import AlumniCard from "@/components/AlumniCard";
import OutreachSection from "@/components/OutreachSection";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ALL_FIELDS_VALUE, OTHER_NOT_SURE_VALUE } from "@/data/careerFields";
import { AlumniProfile } from "@/types/alumni";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? ""
    : "http://localhost:8000");
const AVATAR_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-cyan-500",
  "from-cyan-500 via-sky-600 to-blue-700",
  "from-emerald-500 via-teal-600 to-cyan-600",
  "from-indigo-600 via-purple-600 to-pink-500",
  "from-violet-600 via-indigo-600 to-sky-500",
  "from-amber-500 via-orange-600 to-red-500",
];

function formatApiAlumni(raw: any, index: number): AlumniProfile {
  const name = raw.name || raw.alumnus_name || "Alumnus";
  const initials =
    raw.initials ||
    name
      .split(" ")
      .map((part: string) => part[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const company = raw.company || raw.current_company || "Company";
  const currentRole = raw.currentRole || raw.role || raw.current_role || "Professional";
  const reasons: string[] = Array.isArray(raw.reasons) ? raw.reasons : [];
  const reasonsSummary =
    reasons.join(" ") || raw.relevanceExplanation || raw.career_summary || raw.careerSummary || "";

  return {
    id: raw.id || raw.alumnus_id || `alumni-${index + 1}`,
    name,
    initials,
    university: raw.university || "University Alumni Network",
    degree: raw.degree || "Bachelor's Degree",
    graduationYear: raw.graduationYear || raw.graduation_year || 2020,
    currentRole,
    company,
    location: raw.location || "United States",
    industry: raw.industry || raw.function || "General",
    fieldCategory: raw.fieldCategory || raw.function || "General",
    avatarColor: raw.avatarColor || AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
    matchPercentage:
      raw.matchPercentage || (raw.match_score ? Math.round(raw.match_score * 100) : 75),
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    relevanceExplanation:
      raw.relevanceExplanation ||
      reasonsSummary ||
      `Experienced in ${raw.function || "the field"} at ${company}.`,
    careerPath:
      Array.isArray(raw.careerPath) && raw.careerPath.length > 0
        ? raw.careerPath
        : [
            `Alumni Class of ${raw.graduationYear || raw.graduation_year || 2020}`,
            `Joined ${company}`,
            `${currentRole}`,
          ],
    isAvailableForMentorship:
      raw.isAvailableForMentorship !== undefined ? raw.isAvailableForMentorship : true,
    personalizationRationale:
      raw.personalizationRationale ||
      reasons[0] ||
      `Aligned with your interest in ${raw.function || "this track"} and experience at ${company}.`,
    conversationStarters:
      Array.isArray(raw.conversationStarters) && raw.conversationStarters.length > 0
        ? raw.conversationStarters
        : [
            {
              id: `cs-${raw.id || index}-1`,
              topic: "Career Trajectory",
              starterText: `How did you navigate your career path into ${currentRole} at ${company}?`,
            },
            {
              id: `cs-${raw.id || index}-2`,
              topic: "Core Skills",
              starterText: `What skills or project experiences were most valuable when preparing for ${raw.function || "this domain"}?`,
            },
            {
              id: `cs-${raw.id || index}-3`,
              topic: "Advice for Students",
              starterText: `What advice would you give to a student preparing to enter ${company} today?`,
            },
          ],
    outreachDrafts: raw.outreachDrafts || {
      professional: {
        subject: `Alumni Connection Inquiry — ${currentRole} at ${company}`,
        body: `Dear ${name},\n\nI hope this note finds you well. I am a student preparing to pursue a career in ${raw.function || "your field"}, and I discovered your profile through the Alumni Connector platform.\n\nYour work as ${currentRole} at ${company} is very inspiring. If your schedule permits, I would be immensely grateful for 10–15 minutes of your time for a brief introductory conversation to learn about your path and any advice you have for standing out.\n\nThank you for your time and continued support of our alumni community.\n\nWarm regards,\n[Your Name]`,
      },
      conversational: {
        subject: `Hello from a fellow student & aspiring ${currentRole}!`,
        body: `Hi ${name},\n\nI came across your journey on the Alumni Connector and wanted to reach out! I am currently working on breaking into ${raw.function || "this space"} and loved seeing what you've accomplished at ${company}.\n\nIf your schedule permits a quick 10–15 minute virtual coffee chat over the coming weeks, I would love to hear about your experience.\n\nThanks so much for being an active part of our alumni network!\n\nBest,\n[Your Name]`,
      },
      "in-depth": {
        subject: `Career Trajectory & Industry Preparation — Inquiry for ${name}`,
        body: `Dear ${name},\n\nI am writing to you as an aspiring professional preparing for upcoming recruiting cycles in ${raw.function || "this field"}. Having reviewed your trajectory to ${currentRole} at ${company}, I was particularly drawn to your focus on ${raw.skills?.[0] || "industry practices"}.\n\nI would greatly value your perspective on breaking into the field and standing out during recruitment. If you have 15 minutes available for a brief conversation, I would be deeply grateful for your insights.\n\nSincerely,\n[Your Name]`,
      },
    },
  };
}

export default function Home() {
  const [careerGoal, setCareerGoal] = useState("");
  const [selectedField, setSelectedField] = useState(ALL_FIELDS_VALUE);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniProfile[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
  const [mobileTab, setMobileTab] = useState<"matches" | "outreach">("matches");

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const fieldParam =
        selectedField === ALL_FIELDS_VALUE || selectedField === OTHER_NOT_SURE_VALUE
          ? ""
          : selectedField;

      const response = await fetch(`${API_BASE_URL}/api/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          career_goal: careerGoal,
          selected_field: fieldParam,
          top_k: 5,
          strict_filter: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawList = Array.isArray(data.alumni)
        ? data.alumni
        : (Array.isArray(data.matches) ? data.matches : []);
      const formatted = rawList.map((item: any, idx: number) => formatApiAlumni(item, idx));

      setFilteredAlumni(formatted);
      setSelectedAlumni(formatted[0] || null);
    } catch (error) {
      console.error("Failed to fetch alumni matches from API:", error);
      setFilteredAlumni([]);
      setSelectedAlumni(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfile = (profile: AlumniProfile) => {
    setSelectedAlumni(profile);
    setMobileTab("outreach");
  };

  const handleResetSearch = () => {
    setCareerGoal("");
    setSelectedField(ALL_FIELDS_VALUE);
    setHasSearched(false);
    setFilteredAlumni([]);
    setSelectedAlumni(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 bg-tech-grid">
      {/* Editorial Top Navigation */}
      <header className="border-b border-white/[0.07] bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              A
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans">
                Alumni Connector
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-cyan-500/20">
                Precision Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              1,240+ Verified Alumni Records
            </div>
            <div className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Demo Dataset Mode
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* TASK 3: Premium Hero Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-mono tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            Alumni Career Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your ambition{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              has a network.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Find alumni who have already built the career you&apos;re working toward &mdash;
            understand their journey, discover why they&apos;re relevant, and start the
            conversation.
          </p>
        </section>

        {/* Search Experience: "What are you trying to become?" + Structured Field Selector */}
        <GoalInput
          careerGoal={careerGoal}
          setCareerGoal={setCareerGoal}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* TASK 3: Three-Step Product Explanation */}
        <section className="max-w-4xl mx-auto w-full pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold tracking-wider">
                01 DISCOVER
              </div>
              <h3 className="text-sm font-bold text-white">Find relevant alumni</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter across 18 grouped academic disciplines or enter your specific
                ambition to surface matching graduates.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono text-sky-400 font-bold tracking-wider">
                02 UNDERSTAND
              </div>
              <h3 className="text-sm font-bold text-white">See why they match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect calculated match scores, graduation backgrounds, career trajectories,
                and precise relevance explanations.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-bold tracking-wider">
                03 CONNECT
              </div>
              <h3 className="text-sm font-bold text-white">Generate personalized introduction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Craft executive, casual, or in-depth outreach notes and 3 high-impact
                conversation starters ready to deliver.
              </p>
            </div>
          </div>
        </section>

        {/* Mobile View Switcher */}
        {hasSearched && (
          <div className="lg:hidden flex rounded-xl bg-slate-900 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("matches")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mobileTab === "matches"
                  ? "bg-cyan-500 text-slate-950 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Alumni Matches ({filteredAlumni.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("outreach")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mobileTab === "outreach"
                  ? "bg-cyan-500 text-slate-950 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Outreach Studio {selectedAlumni ? `(${selectedAlumni.name.split(" ")[0]})` : ""}
            </button>
          </div>
        )}

        {/* Content Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* LEFT COLUMN: Alumni Matches */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              mobileTab === "outreach" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.07]">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Alumni Matches</span>
                  {hasSearched && !isLoading && (
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {filteredAlumni.length} verified
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hand-picked alumni profiles aligned with your target career track
                </p>
              </div>

              {selectedField !== ALL_FIELDS_VALUE && (
                <div className="text-[11px] font-mono text-cyan-400 bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.08]">
                  Field: {selectedField}
                </div>
              )}
            </div>

            {/* State 1: Loading State */}
            {isLoading && <LoadingSkeleton />}

            {/* State 2: Zero Results State */}
            {!isLoading && hasSearched && filteredAlumni.length === 0 && (
              <div className="rounded-2xl glass-panel p-10 text-center space-y-4 border border-white/[0.08]">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 9v2m0 4h.01"
                    />
                  </svg>
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">
                    No Direct Alumni Matches Found
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    We could not find alumni matching this exact query and filter.
                    Try selecting &ldquo;All Fields&rdquo; or entering broader terms.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
                  >
                    <span>Reset to All Available Alumni</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* State 3: Pre-Search Blank / Guide State */}
            {!hasSearched && !isLoading && (
              <div className="rounded-2xl glass-panel p-10 text-center space-y-4 border border-dashed border-white/10">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center ring-1 ring-cyan-500/20">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">
                    Alumni Network Standby
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Enter your career goal above, choose from the 18 discipline categories,
                    and click &ldquo;Find Alumni&rdquo; to analyze relevant matches.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] text-[11px] font-mono text-slate-400 border border-white/[0.06]">
                  <span className="text-cyan-400">⚡ TIP:</span>
                  <span>Select any profile to preview the tailored outreach message and conversation starters.</span>
                </div>
              </div>
            )}

            {/* State 4: Displaying Alumni Cards */}
            {!isLoading && hasSearched && filteredAlumni.length > 0 && (
              <div className="space-y-4">
                {filteredAlumni.map((profile) => (
                  <AlumniCard
                    key={profile.id}
                    profile={profile}
                    isSelected={selectedAlumni?.id === profile.id}
                    onSelect={handleSelectProfile}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Outreach Studio (Sticky on Desktop) */}
          <div
            className={`lg:col-span-5 ${
              mobileTab === "matches" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="pb-3 border-b border-white/[0.07]">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-between">
                  <span>Outreach Studio</span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    Live Workspace
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synthesized introductory correspondence &amp; conversation topics
                </p>
              </div>

              <OutreachSection selectedAlumni={selectedAlumni} />
            </div>
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070a]/90 backdrop-blur-md py-10 mt-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Alumni Connector &bull; High-Precision Network Intelligence Platform
          </div>
          <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
            Architected for direct drop-in replacement with production LLM synthesis and vector database matching pipelines.
          </p>
        </div>
      </footer>
    </div>
  );
}

