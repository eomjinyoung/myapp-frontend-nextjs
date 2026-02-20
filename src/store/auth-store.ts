import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

interface AuthActions {
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setTokens: (accessToken, refreshToken) =>
                set({
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                }),

            clearAuth: () =>
                set({
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'auth-storage', // localStorage key name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
