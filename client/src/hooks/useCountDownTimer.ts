import { useOtpStore } from '@/stores/otp.store';
import { formatMinuteSec } from '@/utils/dateTime.utils';
import { useEffect, useState } from 'react';

const useCountDownTimer = () => {
  const { cooldownUntil, clearCooldown } = useOtpStore();
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!cooldownUntil) {
      setRemaining(0);
      return;
    }

    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((cooldownUntil - now) / 1000));
      setRemaining(diff);

      if (diff === 0) {
        clearCooldown();
      }
    };

    updateTime(); // updating immediately

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [cooldownUntil, clearCooldown]);

  return {
    remaining: formatMinuteSec(remaining),
    isCooldownActive: remaining > 0,
  };
};

export default useCountDownTimer;
