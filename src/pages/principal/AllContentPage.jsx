import { useEffect, useMemo, useState } from 'react';
import { contentService } from '../../services/content.service.js';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../../components/ui/Common.jsx';

function AllContentPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await contentService.getAllContent({ status, search });
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError('Unable to load content list');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, search]);

  const rows = useMemo(() => items.slice(0, 1000), [items]);

  return (
    <section>
      <div className="rounded-2xl border border-white/80 bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold">All Content</h2>
        <p className="mt-1 text-sm text-indigo-100">Filter and search all uploaded items in one place.</p>
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md sm:flex-row sm:items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-96"
          placeholder="Search title or subject"
        />
        <div className="text-xs text-slate-500 sm:ml-auto">Showing {rows.length} items</div>
      </div>
      {loading && <div className="mt-4"><LoadingState /></div>}
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {!loading && !error && rows.length === 0 && <div className="mt-4"><EmptyState /></div>}
      {!loading && !error && rows.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/80 bg-white/95 shadow-lg shadow-indigo-100/40">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-slate-100 to-indigo-50 text-left">
              <tr>
                <th className="p-3 font-semibold text-slate-700">Title</th>
                <th className="p-3 font-semibold text-slate-700">Subject</th>
                <th className="p-3 font-semibold text-slate-700">Status</th>
                <th className="p-3 font-semibold text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-indigo-50/40">
                  <td className="p-3 font-medium text-slate-800">{item.title}</td>
                  <td className="p-3 text-slate-600">{item.subject}</td>
                  <td className="p-3"><StatusBadge status={item.status} /></td>
                  <td className="p-3 text-slate-500">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AllContentPage;
