import { AlumniProfile } from "@/types/alumni";

interface AlumniCardProps {
  profile: AlumniProfile;
  isSelected: boolean;
  onSelect: (profile: AlumniProfile) => void;
}

export default function AlumniCard({
  profile,
  isSelected,
  onSelect,
}: AlumniCardProps) {
  return (
    <article
      className={`relative rounded-2xl transition-all duration-300 ${
        isSelected
          ? "bg-[#0E1424] border-2 border-cyan-500/80 shadow-[0_0_35px_-8px_rgba(56,189,248,0.3)] ring-1 ring-cyan-500/40"
          : "glass-panel glass-panel-hover border-white/[0.08]"
      }`}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Header: Avatar, Name, Degree, University & Match Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Avatar with gradient & glow */}
            <div
              className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${profile.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-sm ring-1 ring-white/20 shrink-0`}
            >
              {profile.initials}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  {profile.name}
                </h3>
                {profile.isAvailableForMentorship && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Mentorship
                  </span>
                )}
              </div>

              {/* University & Degree */}
              <p className="text-xs text-slate-300 font-medium">
                {profile.university} &bull; <span className="text-slate-400 font-normal">{profile.degree}</span>
              </p>

              <p className="text-[11px] font-mono text-slate-500">
                Class of {profile.graduationYear} &bull; {profile.location}
              </p>
            </div>
          </div>

          {/* Prominent Match Percentage Gauge */}
          <div className="flex flex-col items-end shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_-3px_rgba(56,189,248,0.25)]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-tight">
                {profile.matchPercentage}%
              </span>
              <span className="text-[10px] uppercase font-mono text-cyan-400/80">
                Match
              </span>
            </div>
          </div>
        </div>

        {/* Current Role, Company & Industry */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-bold text-slate-100 text-sm sm:text-base">
              {profile.currentRole}
            </span>
            <span className="text-slate-500 text-xs">at</span>
            <span className="font-medium text-cyan-300 text-sm">
              {profile.company}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-mono">
            {profile.industry}
          </span>
        </div>

        {/* Career Path Timeline */}
        <div className="space-y-1.5 bg-black/25 p-3 rounded-xl border border-white/[0.05]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Career Trajectory
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            {profile.careerPath.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-medium">{step}</span>
                {idx < profile.careerPath.length - 1 && (
                  <span className="text-slate-600 font-mono">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* "Why this alumni?" Callout */}
        <div className="rounded-xl p-3.5 bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-transparent border border-cyan-500/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold uppercase tracking-wider text-[10px]">
            <svg
              className="w-3.5 h-3.5 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Relevance Analysis &bull; Why This Alumnus Matches
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {profile.relevanceExplanation}
          </p>
        </div>

        {/* Skills / Key Domains */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px] font-mono"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-500">
            {isSelected ? (
              <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Loaded in Outreach Studio
              </span>
            ) : (
              "Click to craft targeted outreach"
            )}
          </span>

          <button
            type="button"
            onClick={() => onSelect(profile)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_-3px_rgba(56,189,248,0.6)]"
                : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/40"
            }`}
          >
            {isSelected ? (
              <>
                <span>Active Profile</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Select & Draft Note</span>
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
