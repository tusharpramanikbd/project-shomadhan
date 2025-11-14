import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  user: any | null;

  setTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
  }) => void;

  setUser: (user: any) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      idToken: null,
      user: null,

      setTokens: ({ accessToken, refreshToken, idToken }) =>
        set({ accessToken, refreshToken, idToken }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          idToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
