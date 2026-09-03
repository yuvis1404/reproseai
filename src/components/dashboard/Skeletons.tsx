const bar = "animate-pulse rounded-md bg-[oklch(0.92_0.01_265)]";
const card =
  "rounded-2xl border border-[oklch(0.93_0.01_265)] bg-paper p-6 shadow-[0_2px_12px_rgba(13,10,26,0.05)]";

function Line({ className = "" }: { className?: string }) {
  return <div className={`${bar} h-4 ${className}`} aria-hidden />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" role="status" aria-label="Loading dashboard">
      <div className={card}>
        <Line className="w-1/3" />
        <Line className="mt-4 w-full" />
        <Line className="mt-3 w-4/5" />
        <div className={`${bar} mt-8 h-12 w-full`} aria-hidden />
      </div>
      <div className={card}>
        <Line className="w-2/5" />
        <Line className="mt-4 w-full" />
        <Line className="mt-3 w-11/12" />
        <Line className="mt-3 w-3/4" />
      </div>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div role="status" aria-label="Loading history">
      <Line className="mt-2 w-52" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={card}>
            <div className="flex items-center gap-2">
              <div className={`${bar} h-5 w-20`} aria-hidden />
              <div className={`${bar} h-5 w-16`} aria-hidden />
            </div>
            <Line className="mt-4 w-full" />
            <Line className="mt-3 w-11/12" />
            <Line className="mt-3 w-2/3" />
            <div className={`${bar} mt-6 h-9 w-28`} aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-[680px] flex-col gap-6"
      role="status"
      aria-label="Loading account"
    >
      <div className={card}>
        <div className="flex items-center gap-4">
          <div className={`${bar} h-16 w-16 shrink-0 rounded-full`} aria-hidden />
          <div className="min-w-0 flex-1">
            <Line className="w-2/3" />
            <Line className="mt-3 w-1/3" />
          </div>
        </div>
      </div>
      <div className={card}>
        <Line className="w-1/3" />
        <Line className="mt-4 w-full" />
        <Line className="mt-3 w-4/5" />
        <div className={`${bar} mt-6 h-3 w-full rounded-full`} aria-hidden />
        <div className={`${bar} mt-6 h-11 w-full`} aria-hidden />
      </div>
    </div>
  );
}
