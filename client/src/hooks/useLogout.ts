import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });

    // Double safety: prevent back using `window.history.pushState`
    setTimeout(() => {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', () => {
        navigate('/login', { replace: true });
      });
    }, 0);
  };

  return { handleLogout };
};

export default useLogout;
