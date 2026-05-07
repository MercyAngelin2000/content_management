import { useEffect, useState } from 'react';
import { approvalService } from '../../services/approval.service.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/Common.jsx';
import { useToast } from '../../hooks/useToast.js';

function PendingApprovalsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await approvalService.getPending();
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError('Unable to load pending approvals');
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const approve = async (id) => {
    try {
      await approvalService.approve(id);
      toast.success('Content approved');
      setReloadKey((v) => v + 1);
    } catch {
      toast.error('Approval failed');
    }
  };

  const submitReject = async () => {
    if (!reason.trim()) return toast.error('Rejection reason is required');
    try {
      await approvalService.reject(rejectTarget, reason);
      toast.success('Content rejected');
      setRejectTarget(null);
      setReason('');
      setReloadKey((v) => v + 1);
    } catch {
      toast.error('Rejection failed');
    }
  };

  return (
    <section>
      <div className="rounded-2xl border border-white/80 bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold">Pending Approvals</h2>
        <p className="mt-1 text-sm text-amber-50">Review uploaded content and take approval actions.</p>
      </div>
      {loading && <div className="mt-4"><LoadingState /></div>}
      {error && <div className="mt-4"><ErrorState message={error} /></div>}
      {!loading && !error && items.length === 0 && <div className="mt-4"><EmptyState message="No pending content." /></div>}
      {!loading && !error && items.length > 0 && (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg shadow-orange-100/50">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.subject}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(item.id)}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-emerald-500 hover:to-teal-500"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectTarget(item.id)}
                    className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-rose-500 hover:to-pink-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <img src={item.fileUrl} alt={item.title} className="mt-3 h-48 w-full rounded-xl object-cover md:w-[360px]" />
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">Rejection Reason</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              rows={4}
              placeholder="Enter mandatory rejection reason"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setRejectTarget(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium">Cancel</button>
              <button onClick={submitReject} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500">Submit Reject</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PendingApprovalsPage;
