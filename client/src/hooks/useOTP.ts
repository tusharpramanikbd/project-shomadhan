import { useLocation, useNavigate } from 'react-router-dom';
import useOtpInput from './useOtpInput';
import { useResendOtp, useVerifyOTP } from '@/services/apis/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { parseJWT } from '@/utils/jwt.utils';
import { toastError, toastSuccess } from '@/components/Toast/CustomToast';

type TOnSubmit = {
  email: string;
  otp: string;
};

const useOtp = () => {
  const { otp, error, isResent, onOTPChange } = useOtpInput();
  const { mutate: verifyOTP, isPending: isVerifyPending } = useVerifyOTP();
  const { mutate: resendOtp, isPending: isResendPending } = useResendOtp();
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const location = useLocation();
  const { email = '', isFromSignUp = true } = location.state || {};

  const handleSubmit = ({ email, otp }: TOnSubmit) => {
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
          toastError(
            error?.message || 'OTP verification failed. Please try again.'
          );
        },
      }
    );
  };

  const handleResend = (email: string) => {
    resendOtp(email, {
      onSuccess: (response) => {
        const { message } = response || {};
        toastSuccess(message || 'OTP resend successfully.');
      },
      onError: (error) => {
        toastError(error?.message || 'Failed to resend OTP. Please try again.');
      },
    });
  };

  return {
    email,
    otp,
    error,
    isResent,
    isFromSignUp,
    isLoading: isVerifyPending || isResendPending,
    handleSubmit,
    handleResend,
    onOTPChange,
  };
};

export default useOtp;
