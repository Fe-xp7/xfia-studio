import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
export function ProtectedRoute() {
  const { admin, loading } = useAuth();
  if (loading) return <div className="fullscreen-loader"><span className="spinner"/>Validando sessão...</div>;
  return admin ? <Outlet/> : <Navigate to="/login" replace/>;
}
