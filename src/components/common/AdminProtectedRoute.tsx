import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.token);
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'admin');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
