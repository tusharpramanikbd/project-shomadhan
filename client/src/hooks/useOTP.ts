import { useLocation, useNavigate } from 'react-router-dom';
import useOtpInput from './useOtpInput';
import { useVerifyOTP } from '@/services/apis/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { parseJWT } from '@/utils/jwt.utils';
import { toastError, toastSuccess } from '@/components/Toast/CustomToast';

type TOnSubmit = {
  email: string;
  otp: string;
};

const useOtp = () => {
  const { otp, error, isResent, onOTPChange } = useOtpInput();
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const location = useLocation();
  const { email = '', isFromSignUp = true } = location.state || {};

  const onSubmit = ({ email, otp }: TOnSubmit) => {
    verifyOTP(
      { email, otp },
      {
        onSuccess: (response) => {
          const { token, data: user, message } = response || {};

          const { isVerified } = parseJWT(token);
          if (!isVerified) {
            console.error('Something went wrong on parsing jwt');
            toastError('Something went wrong. Please try again.');
            return;
          }

          toastSuccess(message || 'OTP verified successfully.');

          setToken(token);
          setUser(user);

          navigate('/feed');
        },
        onError: (error) => {
          console.log('Error Otp Submit', error);
          toastError(
            error?.message || 'OTP verification failed. Please try again.'
          );
        },
      }
    );
  };

  return {
    email,
    otp,
    error,
    isResent,
    isFromSignUp,
    isLoading: isPending,
    onSubmit,
    onOTPChange,
  };
};

export default useOtp;
