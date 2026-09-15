"use client";

import { useState, useEffect } from "react";
import { AlumniProfile, OutreachTone, ConversationStarter } from "@/types/alumni";

interface OutreachSectionProps {
  selectedAlumni: AlumniProfile | null;
}

export default function OutreachSection({ selectedAlumni }: OutreachSectionProps) {
  const [tone, setTone] = useState<OutreachTone>("professional");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedStarterId, setCopiedStarterId] = useState<string | null>(null);
  const [editableBody, setEditableBody] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [variationIndex, setVariationIndex] = useState(0);

  // Sync editable text whenever the selected alumnus or tone changes
  useEffect(() => {
    if (selectedAlumni) {
      setEditableBody(selectedAlumni.outreachDrafts[tone].body);
      setVariationIndex(0);
    }
  }, [selectedAlumni, tone]);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyStarter = async (starter: ConversationStarter) => {
    try {
      await navigator.clipboard.writeText(starter.starterText);
      setCopiedStarterId(starter.id);
      setTimeout(() => setCopiedStarterId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleRegenerate = () => {
    if (!selectedAlumni) return;
    setIsRegenerating(true);
    setTimeout(() => {
      const nextIndex = variationIndex + 1;
      setVariationIndex(nextIndex);

      const baseDraft = selectedAlumni.outreachDrafts[tone].body;
      // Add a subtle intelligent variation based on the regeneration cycle
      let customized = baseDraft;
      if (nextIndex % 2 === 1) {
        customized = baseDraft.replace(
          "I hope this note finds you well.",
          "I hope you are having an inspiring and productive week."
        ).replace(
          "I would be immensely grateful",
          "I would be honored and grateful"
        );
      } else {
        customized = baseDraft.replace(
          "I hope you are having an inspiring and productive week.",
          "I hope this note finds you well."
        );
      }

      setEditableBody(customized);
      setIsRegenerating(false);
    }, 450);
  };

  if (!selectedAlumni) {
    return (
      <section className="rounded-2xl glass-panel p-8 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center ring-1 ring-cyan-500/30">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-bold text-white tracking-tight">
            Outreach Workspace Ready
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select any alumni profile from the matched list to generate a customized
            outreach note, inspect personalization drivers, and view conversation starters.
          </p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20">
          Awaiting Alumnus Selection
        </span>
      </section>
    );
  }

  const currentDraft = selectedAlumni.outreachDrafts[tone];

  return (
    <section className="rounded-2xl glass-panel p-5 sm:p-6 space-y-5 border-white/[0.08]">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${selectedAlumni.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm ring-1 ring-white/20`}
          >
            {selectedAlumni.initials}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Direct Outreach Studio
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {selectedAlumni.name}{" "}
              <span className="font-normal text-slate-400 text-xs">
                &bull; {selectedAlumni.company}
              </span>
            </h3>
          </div>
        </div>

        {/* Tone Selector Pills */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          {(
            [
              { key: "professional", label: "Executive" },
              { key: "conversational", label: "Casual" },
              { key: "in-depth", label: "In-Depth" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTone(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tone === t.key
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* WHY THIS MESSAGE WAS PERSONALIZED Callout */}
      <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-1">
        <div className="flex items-center gap-1.5 text-blue-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why This Message Was Personalized
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {selectedAlumni.personalizationRationale}
        </p>
      </div>

      {/* Subject Line */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Subject Line
          </label>
          <button
            type="button"
            onClick={() => handleCopy(currentDraft.subject, "subject")}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            {copiedField === "subject" ? (
              <>
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              "[copy subject]"
            )}
          </button>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-[#090D17] border border-white/[0.08] text-xs font-mono text-slate-200 select-all">
          {currentDraft.subject}
        </div>
      </div>

      {/* Editable Message Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="outreach-textarea"
            className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold"
          >
            Message Draft (Editable)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              title="Regenerate message variation"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-cyan-400" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRegenerating ? "Synthesizing..." : "Regenerate"}</span>
            </button>
          </div>
        </div>

        <textarea
          id="outreach-textarea"
          rows={10}
          value={editableBody}
          onChange={(e) => setEditableBody(e.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-[#0A0E1A] p-4 text-xs sm:text-sm text-slate-200 font-normal leading-relaxed focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans resize-y"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-500">
            Remember to replace [Your Name] before delivering via LinkedIn or Email.
          </span>

          <button
            type="button"
            onClick={() => handleCopy(editableBody, "body")}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
              copiedField === "body"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_15px_-2px_rgba(16,185,129,0.5)]"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_-3px_rgba(56,189,248,0.5)]"
            }`}
          >
            {copiedField === "body" ? (
              <>
                <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Copy Outreach Message</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Conversation Starters */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            High-Impact Conversation Starters
          </div>
          <span className="text-[10px] font-mono text-slate-500">[click to copy]</span>
        </div>

        <div className="space-y-2">
          {selectedAlumni.conversationStarters.map((starter) => (
            <div
              key={starter.id}
              className="group p-3 rounded-xl border border-white/[0.06] bg-[#090D17] hover:border-cyan-500/40 transition-all text-left flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                  {starter.topic}
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed font-sans">
                  &ldquo;{starter.starterText}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyStarter(starter)}
                className="shrink-0 text-slate-500 group-hover:text-cyan-400 p-1 rounded-md hover:bg-white/5 transition-colors"
                title="Copy conversation starter"
                aria-label={`Copy conversation starter for ${starter.topic}`}
              >
                {copiedStarterId === starter.id ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
