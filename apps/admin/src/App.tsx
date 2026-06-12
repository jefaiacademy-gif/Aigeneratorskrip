import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminStore } from './hooks/useAdminStore';
import AdminLayout from './components/Layout/AdminLayout';
import AdminLogin from './components/Auth/AdminLogin';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import APIKeyManager from './components/APIKeys/APIKeyManager';
import EngineConfig from './components/Engines/EngineConfig';
import UserManager from './components/Users/UserManager';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/api-keys" element={<APIKeyManager />} />
        <Route path="/engines" element={<EngineConfig />} />
        <Route path="/users" element={<UserManager />} />
      </Route>
    </Routes>
  );
}
