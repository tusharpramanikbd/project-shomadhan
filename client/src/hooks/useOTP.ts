import { useLocation } from 'react-router-dom';
import useOtpInput from './useOtpInput';
import useAuthOtp from './useAuthOtp';

const useOtp = () => {
  const { otp, error, isResent, onOTPChange } = useOtpInput();
  const location = useLocation();

  const { email = '', isFromSignUp = true } = location.state || {};

  const { isLoading, onSubmit } = useAuthOtp();

  return {
    email,
    otp,
    error,
    isResent,
    isFromSignUp,
    isLoading,
    onSubmit,
    onOTPChange,
  };
};

export default useOtp;
