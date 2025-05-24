'use client';

import { Box, Container, Flex, theme } from '@chakra-ui/react';
import { useState } from 'react';

import Back from 'components/Back';
import PoolBanner from 'layout/Pool/PoolBanner';
import PoolJoinBattles from 'layout/Pool/PoolJoinBattles';
import PoolMOCBattles from 'layout/Pool/PoolMOCBattles';
import PoolProgress from 'layout/Pool/PoolProgress';

export default () => {
  const [isJoin, setJoin] = useState<boolean>();
  const [isProgress, setIsProgress] = useState<boolean>();

  return (
    <Container
      maxWidth={theme.breakpoints.xl}
      display="flex"
      flexDirection="column"
      my={6}
      gap={6}
    >
      <Back />

      <Flex
        gap={4}
        flexDirection={{
          base: 'column-reverse',
          lg: 'row',
        }}
      >
        <Box
          flexBasis={{
            lg: '40%',
          }}
        >
          {isJoin && <PoolMOCBattles />}

          {!isJoin && <PoolJoinBattles setJoin={setJoin} />}
        </Box>

        <Box
          position="relative"
          flexBasis={{
            lg: '60%',
          }}
        >
          <PoolBanner />

          {isJoin && (
            <PoolProgress
              isJoin={isJoin}
              isProgress={isProgress}
              setIsProgress={setIsProgress}
              setJoin={setJoin}
            />
          )}
        </Box>
      </Flex>
    </Container>
  );
};
