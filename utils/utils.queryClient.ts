import { QueryClient } from '@tanstack/query-core';

export const getQueryCache = () => {
  return new QueryClient();
};

const getQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      notifyOnChangeProps: 'all', // the component will opt-out of smart tracking and re-render whenever a query is updated.
      retry: 1, // Will retry failed requests 1 times before displaying an error
      retryDelay: 2000, // Will always wait 2000ms to retry, regardless of how many retries
      staleTime: 60 * 60 * 1000, // 60-minute
    },
  },
});

export default getQueryClient;
