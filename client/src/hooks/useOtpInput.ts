import { useState } from 'react';

const useOtpInput = () => {
  const [otp, setOtp] = useState('');
  const [isResent, setIsResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOTPChange = (v: string) => {
    setOtp(v);
    setError(null);
  };

  return {
    otp,
    isResent,
    error,
    onOTPChange,
    setIsResent,
    setError,
  };
};

export default useOtpInput;
