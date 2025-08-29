'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { setAccessToken } from '@/lib/api';
import { getDefaultUserId } from '@/lib/utils';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for stored tokens on app initialization
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (refreshToken && accessToken && userData) {
      try {
        // Set the access token for API requests
        setAccessToken(accessToken);
        
        // Parse and set user data
        const user = JSON.parse(userData);
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return <>{children}</>;
}