import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  division: string | null;
  district: string | null;
  upazila: string | null;
  isVerified: boolean;
};

interface AuthState {
  accessToken: string | null;
  user: User | null;

  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
