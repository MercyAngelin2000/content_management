import { useEffect, useMemo, useState } from 'react';
import { contentService } from '../../services/content.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { EmptyState, ErrorState, LoadingState, StatCard } from '../../components/ui/Common.jsx';

function TeacherDashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await contentService.getTeacherContent(user.id);
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError('Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user.id]);

  const stats = useMemo(() => {
    const base = { total: items.length, pending: 0, approved: 0, rejected: 0 };
    items.forEach((i) => {
      if (i.status in base) base[i.status] += 1;
    });
    return base;
  }, [items]);

  return (
    <section>
      <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">Track your content and approval status.</p>
      {loading && <div className="mt-5"><LoadingState /></div>}
      {error && <div className="mt-5"><ErrorState message={error} /></div>}
      {!loading && !error && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Uploaded" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Approved" value={stats.approved} />
          <StatCard label="Rejected" value={stats.rejected} />
        </div>
      )}
      {!loading && !error && items.length === 0 && <div className="mt-4"><EmptyState message="No uploaded content yet." /></div>}
    </section>
  );
}

export default TeacherDashboardPage;
