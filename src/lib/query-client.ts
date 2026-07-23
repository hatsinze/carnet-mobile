import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute — reasonable default, tuned per-query later
      refetchOnWindowFocus: false, // not meaningful on native, avoids surprise refetches
    },
  },
});