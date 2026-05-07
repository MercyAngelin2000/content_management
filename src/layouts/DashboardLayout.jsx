import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/upload', label: 'Upload Content' },
    { to: '/teacher/content', label: 'My Content' },
  ];
  const principalLinks = [
    { to: '/principal/dashboard', label: 'Dashboard' },
    { to: '/principal/approvals', label: 'Pending Approval' },
    { to: '/principal/content', label: 'All Content' },
  ];
  const navLinks = user?.role === 'principal' ? principalLinks : teacherLinks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-sky-50 md:flex">
      <aside className="w-full border-b border-white/40 bg-slate-900/95 p-5 text-white shadow-2xl md:min-h-screen md:w-72 md:border-b-0 md:border-r md:backdrop-blur">
        <h1 className="mb-1 text-xl font-bold tracking-wide">Broadcast CMS</h1>
        <p className="mb-5 text-xs text-slate-300">Content Broadcasting Panel</p>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-gradient-to-r from-indigo-500 to-sky-500 font-semibold text-white shadow-lg' : 'text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-xs text-slate-200">
          <p className="font-semibold">{user?.name}</p>
          <p className="truncate text-slate-300">{user?.email}</p>
          <Link className="mt-2 inline-block font-semibold text-sky-300 hover:text-sky-200" to={`/live/${user?.id}`}>
            Public Live Preview
          </Link>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="mt-4 w-full rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold transition hover:bg-rose-500"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
