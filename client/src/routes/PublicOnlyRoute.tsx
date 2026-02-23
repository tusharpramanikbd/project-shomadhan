import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

const PublicOnlyRoute = () => {
  const { accessToken, user } = useAuthStore();

  const isAuthenticated = !!accessToken && !!user;

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
