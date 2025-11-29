import { useAuthStore } from '@/stores/auth.store';
import { useOtpStore } from '@/stores/otp.store';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const { logout } = useAuthStore();
  const { clearCooldown } = useOtpStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCooldown();
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
