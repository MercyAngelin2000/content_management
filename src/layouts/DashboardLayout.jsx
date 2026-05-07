import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-sky-50 md:flex">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-slate-900 px-4 py-3 text-white md:hidden">
        <h1 className="text-lg font-bold">Broadcast CMS</h1>
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-lg border border-slate-700 p-2"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-auto w-72 border-r border-white/40 bg-slate-900/95 p-5 text-white shadow-2xl transition-transform md:static md:block md:min-h-screen md:translate-x-0 md:backdrop-blur ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h1 className="mb-1 text-xl font-bold tracking-wide">Broadcast CMS</h1>
        <p className="mb-5 text-xs text-slate-300">Content Broadcasting Panel</p>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
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
            closeSidebar();
          }}
          className="mt-4 w-full rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold transition hover:bg-rose-500"
        >
          Logout
        </button>
      </aside>
      <main key={location.pathname} className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
