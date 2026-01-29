export default function SkeletonCard() {
  return (
    <div className="glass-effect w-full rounded-2xl p-6 animate-pulse border border-slate-600">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="h-32 w-32 md:h-40 md:w-40 rounded-xl bg-slate-700/50" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-2/3 rounded-lg bg-slate-700/50" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-700/50" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-lg bg-slate-700/50" />
            <div className="h-4 w-3/4 rounded-lg bg-slate-700/50" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded-lg bg-slate-700/50" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
