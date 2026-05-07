import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { contentService } from '../../services/content.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { toFilePreview } from '../../utils/contentStatus.js';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  file: z.any().refine((v) => v?.[0], 'File is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startClock: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endClock: z.string().min(1, 'End time is required'),
  rotationDuration: z.coerce.number().min(5).max(600),
}).refine((v) => new Date(`${v.endDate}T${v.endClock}`) > new Date(`${v.startDate}T${v.startClock}`), {
  message: 'End time must be later than start time',
  path: ['endClock'],
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;

function UploadContentPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rotationDuration: 30 },
  });

  const onSubmit = async (values) => {
    const file = values.file[0];
    if (!ALLOWED_TYPES.includes(file.type)) return toast.error('Allowed file types: JPG, PNG, GIF');
    if (file.size > MAX_SIZE) return toast.error('Max file size is 10MB');
    setSubmitting(true);
    try {
      const startTime = new Date(`${values.startDate}T${values.startClock}`).toISOString();
      const endTime = new Date(`${values.endDate}T${values.endClock}`).toISOString();

      await contentService.uploadContent({
        title: values.title,
        subject: values.subject,
        description: values.description || '',
        fileUrl: toFilePreview(file),
        startTime,
        endTime,
        rotationDuration: values.rotationDuration,
      }, user.id);
      toast.success('Content uploaded and sent for approval');
      reset({
        title: '',
        subject: '',
        description: '',
        startDate: '',
        startClock: '',
        endDate: '',
        endClock: '',
        rotationDuration: 30,
        file: null,
      });
      setPreview('');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl border border-white/80 bg-gradient-to-r from-indigo-600 to-sky-600 p-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold">Upload Content</h2>
        <p className="mt-1 text-sm text-indigo-100">Add classroom content and schedule it for broadcast approval.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5 rounded-2xl border border-white/70 bg-white/95 p-6 shadow-xl">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Title</label>
          <input
            {...register('title')}
            placeholder="e.g. Algebra Revision Slide"
            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Subject</label>
          <input
            {...register('subject')}
            placeholder="e.g. Math"
            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
          <textarea
            {...register('description')}
            placeholder="Optional details about the content"
            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            rows={3}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Upload Image (JPG, PNG, GIF)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          {...register('file')}
          onChange={(e) => {
            register('file').onChange(e);
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : '');
          }}
          className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2.5 text-sm"
        />
        </div>
        {errors.file && <p className="text-xs text-red-600">{errors.file.message}</p>}
        {preview && (
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-700">Preview</p>
            <img src={preview} alt="Preview" className="h-44 w-full rounded-lg border border-sky-100 object-cover" />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-semibold text-slate-700">Start</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <input
              type="time"
              {...register('startClock')}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.startDate && <p className="text-xs text-red-600">{errors.startDate.message}</p>}
            {errors.startClock && <p className="text-xs text-red-600">{errors.startClock.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-semibold text-slate-700">End</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <input
              type="time"
              {...register('endClock')}
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.endDate && <p className="text-xs text-red-600">{errors.endDate.message}</p>}
            {errors.endClock && <p className="text-xs text-red-600">{errors.endClock.message}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Rotation Duration (seconds)</label>
          <input
            type="number"
            {...register('rotationDuration')}
            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. 30"
          />
        </div>
        <button
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 p-3 font-semibold text-white transition hover:from-indigo-500 hover:to-sky-500 disabled:opacity-60"
        >
          {submitting ? 'Uploading...' : 'Submit Content'}
        </button>
      </form>
    </section>
  );
}

export default UploadContentPage;
