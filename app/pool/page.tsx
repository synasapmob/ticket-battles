'use client';

import { Box, Container, Flex, Skeleton, theme } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Back from 'components/Back';
import PoolBanner from 'layout/Pool/PoolBanner';
import PoolJoinBattles from 'layout/Pool/PoolJoinBattles';
import PoolMOCBattles from 'layout/Pool/PoolMOCBattles';
import PoolProgress from 'layout/Pool/PoolProgress';
import { TypePoolMetadata } from 'types/types.pool';

export default () => {
  const current_account = useCurrentAccount();

  const [isProgress, setIsProgress] = useState<string>();
  const [isJoin, setJoin] = useState<boolean>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pool_get'],
    queryFn: async () => {
      const { data } = await axios.get<TypePoolMetadata[]>('/api/pool');

      return data;
    },
  });

  useEffect(() => {
    if (data?.length) {
      const isJoin = data.some(arg => arg.owner === current_account?.address);

      setJoin(isJoin);
    }
  }, [current_account?.address, data]);

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
          {isLoading && <Skeleton height="lg" />}

          {!isLoading && (
            <>
              {isJoin && <PoolMOCBattles data={data} />}

              {!isJoin && (
                <PoolJoinBattles
                  setIsProgress={setIsProgress}
                  setJoin={setJoin}
                  onSuccess={refetch}
                />
              )}
            </>
          )}
        </Box>

        <Box
          position="relative"
          flexBasis={{
            lg: '60%',
          }}
        >
          <PoolBanner />

          <PoolProgress
            isJoin={isJoin}
            isProgress={isProgress}
            setIsProgress={setIsProgress}
          />
        </Box>
      </Flex>
    </Container>
  );
};
