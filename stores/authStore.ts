'use client';

import { create } from 'zustand';
import { User } from '@/types';
import { setAccessToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    // In a real app, you'd want to store refresh token securely
    localStorage.setItem('refreshToken', refreshToken);
  },

  logout: () => {
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));