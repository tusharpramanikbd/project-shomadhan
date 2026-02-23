import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

const ProtectedRoute = () => {
  const { accessToken, user } = useAuthStore();

  const isAuthenticated = !!accessToken && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
