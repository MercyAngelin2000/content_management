import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const toast = useToast();
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname;
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setError('');
    try {
      const user = await login(values);
      toast.success('Login successful');
      const fallback = user.role === 'principal' ? '/principal/dashboard' : '/teacher/dashboard';
      navigate(from || fallback, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
      toast.error('Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-900 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-7 shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900">Content Broadcasting Login</h1>
        <p className="mt-2 text-sm text-slate-600">Use teacher@school.com / 123456 or principal@school.com / 123456</p>
        <div className="mt-5 space-y-4">
          <div>
            <input {...register('email')} className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Email" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <input type="password" {...register('password')} className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Password" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 p-2.5 font-semibold text-white transition hover:from-indigo-500 hover:to-sky-500 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
