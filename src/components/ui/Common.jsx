export function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-indigo-100/40 backdrop-blur">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 bg-gradient-to-r from-indigo-700 to-sky-600 bg-clip-text text-3xl font-bold text-transparent">{value}</p>
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return <div className="rounded-2xl border border-indigo-100 bg-white/90 p-6 text-sm text-slate-600 shadow-sm">{message}</div>;
}

export function EmptyState({ message = 'No data available' }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">{message}</div>;
}

export function ErrorState({ message = 'Something went wrong' }) {
  return <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm">{message}</div>;
}

export function StatusBadge({ status }) {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    active: 'bg-sky-100 text-sky-700',
    scheduled: 'bg-violet-100 text-violet-700',
    expired: 'bg-slate-200 text-slate-700',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}
