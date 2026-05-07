import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import LoginPage from './pages/auth/LoginPage.jsx';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage.jsx';
import UploadContentPage from './pages/teacher/UploadContentPage.jsx';
import MyContentPage from './pages/teacher/MyContentPage.jsx';
import PrincipalDashboardPage from './pages/principal/PrincipalDashboardPage.jsx';
import PendingApprovalsPage from './pages/principal/PendingApprovalsPage.jsx';
import AllContentPage from './pages/principal/AllContentPage.jsx';
import LiveContentPage from './pages/public/LiveContentPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'principal' ? (
    <Navigate to="/principal/dashboard" replace />
  ) : (
    <Navigate to="/teacher/dashboard" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/live/:teacherId" element={<LiveContentPage />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="upload" element={<UploadContentPage />} />
        <Route path="content" element={<MyContentPage />} />
      </Route>

      <Route
        path="/principal"
        element={
          <ProtectedRoute allowedRoles={['principal']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PrincipalDashboardPage />} />
        <Route path="approvals" element={<PendingApprovalsPage />} />
        <Route path="content" element={<AllContentPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
