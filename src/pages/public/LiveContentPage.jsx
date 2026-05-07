import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../../services/content.service.js';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../../components/ui/Common.jsx';

function LiveContentPage() {
  const { teacherId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    const load = async () => {
      try {
        setError('');
        const data = await contentService.getLiveContent(teacherId);
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setError('Unable to fetch live content');
      } finally {
        setLoading(false);
      }
    };
    load();
    timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [teacherId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50">
      <div className="mx-auto max-w-5xl p-5">
        <div className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800">Live Broadcast</h1>
          <p className="mt-1 text-sm text-slate-500">Teacher: {teacherId}</p>
        </div>
      {loading && <div className="mt-5"><LoadingState message="Loading live content..." /></div>}
      {error && <div className="mt-5"><ErrorState message={error} /></div>}
      {!loading && !error && items.length === 0 && <div className="mt-5"><EmptyState message="No content available" /></div>}
      {!loading && !error && items.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/80 bg-white p-4 shadow-lg shadow-sky-100/60">
              <img src={item.fileUrl} alt={item.title} className="h-56 w-full rounded-xl object-cover" />
              <h2 className="mt-3 text-xl font-bold text-slate-800">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.subject}</p>
              <div className="mt-2"><StatusBadge status="active" /></div>
            </article>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}

export default LiveContentPage;
