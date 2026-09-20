"use client";

import { useState, useMemo } from "react";
import {
  CAREER_CATEGORIES,
  POPULAR_CAREER_FIELDS,
  ALL_FIELDS_VALUE,
  OTHER_NOT_SURE_VALUE,
} from "@/data/careerFields";

interface CareerFieldSelectorProps {
  selectedField: string;
  onSelectField: (field: string) => void;
}

export default function CareerFieldSelector({
  selectedField,
  onSelectField,
}: CareerFieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Technology & Digital": true,
    "Business & Consulting": true,
    "Finance & Accounting": true,
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Filter categories and fields based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CAREER_CATEGORIES;

    return CAREER_CATEGORIES.map((cat) => {
      const matchesCat = cat.name.toLowerCase().includes(q);
      const matchingFields = cat.fields.filter((f) =>
        f.toLowerCase().includes(q)
      );
      if (matchesCat || matchingFields.length > 0) {
        return {
          ...cat,
          fields: matchesCat ? cat.fields : matchingFields,
        };
      }
      return null;
    }).filter(Boolean) as typeof CAREER_CATEGORIES;
  }, [searchQuery]);

  const handleSelect = (field: string) => {
    onSelectField(field);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Label and Selected Field Display Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Target Field / Discipline
          </span>
          {selectedField !== ALL_FIELDS_VALUE && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span>{selectedField}</span>
              <button
                type="button"
                onClick={() => onSelectField(ALL_FIELDS_VALUE)}
                className="hover:text-white transition-colors"
                title="Reset to All Fields"
              >
                &times;
              </button>
            </span>
          )}
        </div>

        {/* Modal / Explorer Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-auto text-xs font-medium px-3 py-1 rounded-lg glass-panel hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span>{isOpen ? "Close Catalog" : "Browse All 18 Disciplines"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-cyan-300">
            18 Categories
          </span>
        </button>
      </div>

      {/* Popular Shortcuts Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-mono text-slate-500 uppercase shrink-0 mr-1">
          Quick:
        </span>
        <button
          type="button"
          onClick={() => onSelectField(ALL_FIELDS_VALUE)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
            selectedField === ALL_FIELDS_VALUE
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
              : "glass-panel text-slate-400 hover:text-slate-200 hover:border-white/20"
          }`}
        >
          {ALL_FIELDS_VALUE}
        </button>

        {POPULAR_CAREER_FIELDS.map((field) => (
          <button
            key={field}
            type="button"
            onClick={() => onSelectField(field)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              selectedField === field
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                : "glass-panel text-slate-400 hover:text-slate-200 hover:border-white/20"
            }`}
          >
            {field}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onSelectField(OTHER_NOT_SURE_VALUE)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
            selectedField === OTHER_NOT_SURE_VALUE
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "glass-panel text-slate-400 hover:text-slate-200 hover:border-white/20"
          }`}
        >
          {OTHER_NOT_SURE_VALUE}
        </button>
      </div>

      {/* Expanded Comprehensive Drawer / Selector */}
      {isOpen && (
        <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-cyan-500/20 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box inside catalog */}
          <div className="relative">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 150+ career fields and academic disciplines..."
              className="w-full bg-[#0A0E18] text-slate-100 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Special Options */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleSelect(ALL_FIELDS_VALUE)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-cyan-500/10 text-slate-200 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              ✦ Show All Fields & Industries
            </button>
            <button
              type="button"
              onClick={() => handleSelect(OTHER_NOT_SURE_VALUE)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-purple-500/10 text-slate-200 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              ? Undecided / Career Exploration
            </button>
          </div>

          {/* Grouped Accordions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredCategories.map((category) => {
              const isExpanded = !!expandedCategories[category.name] || searchQuery.length > 0;
              return (
                <div
                  key={category.name}
                  className="rounded-xl bg-[#0B0F19]/90 border border-white/[0.06] p-3 space-y-2 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      {category.fields.length}
                      <svg
                        className={`w-3 h-3 transform transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {category.fields.map((field) => {
                        const isFieldSelected = selectedField === field;
                        return (
                          <button
                            key={field}
                            type="button"
                            onClick={() => handleSelect(field)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all text-left ${
                              isFieldSelected
                                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50"
                                : "bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]"
                            }`}
                          >
                            {field}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs">
              No categories match &ldquo;{searchQuery}&rdquo;. Try another term or choose &ldquo;Other / Not sure yet&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
