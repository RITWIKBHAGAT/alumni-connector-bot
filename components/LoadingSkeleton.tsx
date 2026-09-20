export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-slate-800 rounded" />
                <div className="h-3 w-52 bg-slate-800/80 rounded" />
              </div>
            </div>
            <div className="h-7 w-24 bg-slate-800 rounded-xl" />
          </div>

          <div className="flex gap-2">
            <div className="h-5 w-28 bg-slate-800 rounded-md" />
            <div className="h-5 w-20 bg-slate-800 rounded-md" />
          </div>

          <div className="h-16 w-full bg-slate-900/60 rounded-xl border border-white/[0.04]" />

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1.5">
              <div className="h-6 w-16 bg-slate-800 rounded-md" />
              <div className="h-6 w-20 bg-slate-800 rounded-md" />
            </div>
            <div className="h-9 w-32 bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
