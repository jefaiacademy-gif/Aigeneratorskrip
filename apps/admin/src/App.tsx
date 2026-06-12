import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminStore } from './hooks/useAdminStore';
import AdminLogin from './components/Auth/AdminLogin';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import APIKeyManager from './components/APIKeys/APIKeyManager';
import EngineConfig from './components/Engines/EngineConfig';
import UserManager from './components/Users/UserManager';

function App() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin />
      } />
      <Route path="/*" element={
        isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="api-keys" element={<APIKeyManager />} />
        <Route path="engines" element={<EngineConfig />} />
        <Route path="users" element={<UserManager />} />
      </Route>
    </Routes>
  );
}

export default App;
