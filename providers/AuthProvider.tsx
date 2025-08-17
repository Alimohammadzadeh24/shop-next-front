'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { setAccessToken } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for stored tokens on app initialization
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // In a real app, you'd validate the refresh token and get user data
      // For now, just set loading to false
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return <>{children}</>;
}