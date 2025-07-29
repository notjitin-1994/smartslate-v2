import React from 'react';
import { Toaster } from "../ui/toaster";
import { Toaster as Sonner } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '../../contexts/AuthContext';
import { ModalProvider } from '../../contexts/ModalContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </TooltipProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};