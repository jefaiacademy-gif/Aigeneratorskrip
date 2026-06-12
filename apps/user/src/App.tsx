import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import LoginSignup from './components/Auth/LoginSignup';
import MainLayout from './pages/MainLayout';

function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginSignup />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
