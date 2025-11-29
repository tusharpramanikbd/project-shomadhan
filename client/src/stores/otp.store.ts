import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OtpState {
  cooldownUntil: number | null;
  email: string | null;

  setCooldown: (until: number) => void;
  clearCooldown: () => void;
  setEmail: (email: string) => void;
}

export const useOtpStore = create<OtpState>()(
  persist(
    (set) => ({
      cooldownUntil: null,
      email: null,

      setCooldown: (until) => set({ cooldownUntil: until }),
      clearCooldown: () => set({ cooldownUntil: null }),
      setEmail: (email) => set({ email }),
    }),
    {
      name: 'otp-store',
    }
  )
);
