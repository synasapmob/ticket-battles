'use client';

import { Box, Container, Flex, Skeleton, theme } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect, useMemo } from 'react';

import Back from 'components/Back';
import useDevInspect from 'hook/useDevInspect';
import useQueryEvent from 'hook/useQueryEvent';
import PoolBanner from 'layout/Pool/PoolBanner';
import PoolJoinBattles from 'layout/Pool/PoolJoinBattles';
import PoolMOCBattles from 'layout/Pool/PoolMOCBattles';
import PoolProgress from 'layout/Pool/PoolProgress';
import { TypePoolEventPool } from 'types/types.pool';
import getQueryClient from 'utils/utils.queryClient';

export default () => {
  const current_account = useCurrentAccount();

  const getPoolsFromEvents = useQueryEvent<TypePoolEventPool>({
    type: 'pool::PoolEvent',
    options: {
      limit: 1,
    },
  });

  const getDevInspectEnoughParticipants = useDevInspect({
    type: 'shared::ENOUGH_PARTICIPANTS_POOL',
  });

  const getEnoughParticipants = getDevInspectEnoughParticipants.data?.length
    ? Number(
        bcs
          .u64()
          .parse(
            bcs
              .byteVector()
              .serialize(getDevInspectEnoughParticipants.data[0][0])
              .parse()
          )
      )
    : 0;

  const isJoined = useMemo(
    () =>
      getPoolsFromEvents.data?.some(meta => {
        return meta?.participants?.some(
          participant => participant === current_account?.address
        );
      }),
    [current_account?.address, getPoolsFromEvents.data]
  );

  const winner = useMemo(
    () =>
      getPoolsFromEvents.data?.find(
        meta => !!meta?.winner && !!meta.participants.length
      )?.winner,
    [getPoolsFromEvents.data]
  );

  // handler realtime fake :))
  useEffect(() => {
    const subscribe = setInterval(async () => {
      const request = await fetch('/api/pool', {
        method: 'GET',
      });

      const toJSON: TypePoolEventPool | null = await request.json();

      if (toJSON) {
        getQueryClient.setQueryData<TypePoolEventPool[]>(
          ['useQueryEvent', 'pool::PoolEvent'],
          [toJSON]
        );
      }
    }, 3000);

    return () => {
      clearInterval(subscribe);
    };
  }, [getPoolsFromEvents]);

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
          {getPoolsFromEvents.isLoading && <Skeleton height="lg" />}

          {!getPoolsFromEvents.isLoading && (
            <>
              {isJoined && getPoolsFromEvents.data?.length && (
                <PoolMOCBattles
                  pools={getPoolsFromEvents.data}
                  getEnoughParticipants={getEnoughParticipants}
                />
              )}

              {!isJoined && (
                <PoolJoinBattles
                  getEnoughParticipants={getEnoughParticipants}
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
            getEnoughParticipants={getEnoughParticipants}
            winner={winner}
            isJoined={isJoined}
            onSuccess={getPoolsFromEvents.refetch}
          />
        </Box>
      </Flex>
    </Container>
  );
};
