'use client';

import { Box, Container, Flex, Skeleton, theme } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import Back from 'components/Back';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import PoolBanner from 'layout/Pool/PoolBanner';
import PoolJoinBattles from 'layout/Pool/PoolJoinBattles';
import PoolMOCBattles from 'layout/Pool/PoolMOCBattles';
import PoolProgress from 'layout/Pool/PoolProgress';
import { TypeWalletEnum } from 'types';
import { TypePoolEventPool } from 'types/types.pool';
import getQueryClient from 'utils/utils.queryClient';
import utilsSui from 'utils/utils.sui';

export default () => {
  const { extension } = useExtensionContext();
  const { account } = useAccountContext();

  const getEnoughParticipants = useQuery({
    queryKey: ['enough_participants_pool', extension],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        const view = await utilsSui.devInspect(
          'shared::ENOUGH_PARTICIPANTS_POOL'
        );

        return view?.length
          ? Number(
              bcs.u64().parse(bcs.byteVector().serialize(view[0][0]).parse())
            )
          : 0;
      }
    },
  });

  const getPoolsFromEvents = useQuery({
    queryKey: ['pool_events', extension],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        const { data } = await utilsSui.getSuiClient.queryEvents({
          query: {
            MoveEventType: `${utilsSui.PROGRAM.PACKAGE_ID}::pool::PoolEvent`,
          },
          limit: 1,
        });

        return data.map(meta => meta.parsedJson as TypePoolEventPool);
      }
    },
  });

  const isJoined = useMemo(
    () =>
      getPoolsFromEvents.data?.some(meta => {
        return meta?.participants?.some(participant => participant === account);
      }),
    [account, getPoolsFromEvents.data]
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
    }, 5000);

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
                  getEnoughParticipants={getEnoughParticipants.data || 0}
                />
              )}

              {!isJoined && (
                <PoolJoinBattles
                  getEnoughParticipants={getEnoughParticipants.data || 0}
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
            getEnoughParticipants={getEnoughParticipants.data || 0}
            winner={winner}
            isJoined={isJoined}
            onSuccess={getPoolsFromEvents.refetch}
          />
        </Box>
      </Flex>
    </Container>
  );
};
