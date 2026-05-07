import { useEffect, useMemo, useState } from 'react';
import { contentService } from '../../services/content.service.js';
import { EmptyState, ErrorState, LoadingState, StatCard } from '../../components/ui/Common.jsx';

function PrincipalDashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await contentService.getAllContent({ status: 'all' });
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load principal dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const base = { total: items.length, pending: 0, approved: 0, rejected: 0 };
    items.forEach((i) => {
      if (i.status in base) base[i.status] += 1;
    });
    return base;
  }, [items]);

  return (
    <section>
      <h2 className="text-2xl font-semibold">Principal Dashboard</h2>
      {loading && <div className="mt-4"><LoadingState /></div>}
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {!loading && !error && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="All Content" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Approved" value={stats.approved} />
          <StatCard label="Rejected" value={stats.rejected} />
        </div>
      )}
      {!loading && !error && items.length === 0 && <div className="mt-4"><EmptyState /></div>}
    </section>
  );
}

export default PrincipalDashboardPage;
