'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

let toastCounter = 0;
const toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function addToast(toast: Omit<Toast, 'id'>) {
  const id = (toastCounter++).toString();
  const newToast = { id, duration: 5000, ...toast };
  
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));
  
  setTimeout(() => {
    removeToast(id);
  }, newToast.duration);
  
  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id);
  toastListeners.forEach(listener => listener(toasts));
}

export function toast(toast: Omit<Toast, 'id'>) {
  return addToast(toast);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);
  
  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    toastListeners.push(listener);
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);
  
  // Subscribe to toast updates
  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      removeToast(toastId);
    } else {
      toasts = [];
      toastListeners.forEach(listener => listener(toasts));
    }
  }, []);
  
  return {
    toasts: localToasts,
    toast: addToast,
    dismiss,
  };
}