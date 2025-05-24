'use client';

import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import Header from 'layout/Header';

export default ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />

      <Box as="main">{children}</Box>
    </>
  );
};
