import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { contentService } from '../../services/content.service.js';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../../components/ui/Common.jsx';
import { getScheduleState } from '../../utils/contentStatus.js';

function MyContentPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await contentService.getTeacherContent(user.id);
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError('Could not load your content');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  return (
    <section>
      <h2 className="text-3xl font-bold text-slate-800">My Content</h2>
      <p className="mt-1 text-sm text-slate-500">View uploaded content, approval status, and schedule state.</p>
      {loading && <div className="mt-4"><LoadingState /></div>}
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {!loading && !error && items.length === 0 && <div className="mt-4"><EmptyState /></div>}
      {!loading && !error && items.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.slice(0, 200).map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg shadow-indigo-100/50 transition hover:-translate-y-0.5 hover:shadow-xl">
              <img src={item.fileUrl} alt={item.title} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
              <h3 className="mt-3 font-semibold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.subject}</p>
              <div className="mt-2 flex gap-2">
                <StatusBadge status={item.status} />
                <StatusBadge status={getScheduleState(item.startTime, item.endTime)} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
              </p>
              {item.rejectionReason && <p className="mt-2 text-xs text-rose-600">Reason: {item.rejectionReason}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyContentPage;
