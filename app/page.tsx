'use client';

import { Container, theme } from '@chakra-ui/react';

import HomeArticle from 'layout/Home/HomeArticle';
import HomeNotification from 'layout/Home/HomeNotification';

export default () => {
  return (
    <Container maxWidth={theme.breakpoints.xl} my={6}>
      <HomeNotification />

      <HomeArticle />
    </Container>
  );
};
