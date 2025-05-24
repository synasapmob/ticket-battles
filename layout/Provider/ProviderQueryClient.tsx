'use client';

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren } from 'react';

import getQueryClient from 'utils/utils.queryClient';

let browserQueryClient: QueryClient | undefined = undefined;

function getNewQuery() {
  /* 
    Server: 
      1. always make a new query client to avoid cache and slowly data
      2. because 'always make new' so you need re-make-ssr
  */
  if (isServer) {
    const new_server = new QueryClient({
      defaultOptions: getQueryClient.getDefaultOptions(), // reusable
    });

    browserQueryClient = new_server;
  }

  /* 
    Browser:
      1. 
        make a new query client if we don't already have one
        This is very important, so we don't re-make a new client if React
        suspends during the initial render. This may not be needed if we
        have a suspense boundary BELOW the creation of the query client

      2.
        in client/server necessary 'envinroments' as the same thereforce you need make SSR in this line. 
  */
  if (!browserQueryClient) {
    browserQueryClient = getQueryClient;
  }

  return browserQueryClient;
}

export default ({ children }: PropsWithChildren) => {
  /* 
    NOTE: 
      Avoid useState when initializing the query client if you don't
      have a suspense boundary between this and the code that may
      suspend because React will throw away the client on the initial
      render if it suspends and there is no boundary
  */
  const queryClient = getNewQuery();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
