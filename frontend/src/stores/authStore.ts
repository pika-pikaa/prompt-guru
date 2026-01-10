import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import { api, apiHelpers } from '@/lib/api';
import { storage, STORAGE_KEYS } from '@/lib/utils';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  checkAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, accessToken, refreshToken } = response.data.data;

          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          storage.set(STORAGE_KEYS.USER, user);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message = apiHelpers.getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', credentials);
          const { user, accessToken, refreshToken } = response.data.data;

          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          storage.set(STORAGE_KEYS.USER, user);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message = apiHelpers.getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshTokens: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await api.post('/auth/refresh', {
            refreshToken: currentRefreshToken,
          });
          const { accessToken, refreshToken } = response.data.data;

          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

          set({
            accessToken,
            refreshToken,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setUser: (user: User | null) => {
        if (user) {
          storage.set(STORAGE_KEYS.USER, user);
        } else {
          storage.remove(STORAGE_KEYS.USER);
        }
        set({ user, isAuthenticated: !!user });
      },

      setTokens: (accessToken: string | null, refreshToken: string | null) => {
        if (accessToken) {
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        } else {
          storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        }
        if (refreshToken) {
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        } else {
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        }
        set({ accessToken, refreshToken });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const accessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        const user = storage.get<User>(STORAGE_KEYS.USER);

        if (accessToken && user) {
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
