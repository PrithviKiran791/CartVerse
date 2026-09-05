import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, SignupData } from '../types/auth';
import { loginRequest, signupRequest, getCurrentUser, logoutRequest } from '../api/authApi';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginRequest(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage = err?.message || 'Login failed. Please check your credentials.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      signup: async (data: SignupData): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const response = await signupRequest(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage = err?.message || 'Registration failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: async (): Promise<void> => {
        const token = get().token;
        try {
          if (token) {
            await logoutRequest(token);
          }
        } catch {
          // Ignore server logout errors on client-side clear
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        }
      },

      hydrateFromStorage: async (): Promise<void> => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          // Validate stored token against the server
          const validatedUser = await getCurrentUser(token);
          set({
            user: validatedUser,
            isAuthenticated: true,
            error: null,
          });
        } catch (err: any) {
          // Token is invalid/expired — clear credentials silently
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'cartverse-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: !!state.token,
      }),
    }
  )
);
