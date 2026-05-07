import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="mt-2 text-slate-500">The requested route does not exist.</p>
      <Link className="mt-4 rounded bg-slate-900 px-4 py-2 text-white" to="/">
        Go Home
      </Link>
    </main>
  );
}

export default NotFoundPage;
