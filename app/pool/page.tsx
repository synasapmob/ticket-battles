'use client';

import { Box, Container, Flex, Skeleton, theme } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

import Back from 'components/Back';
import PoolBanner from 'layout/Pool/PoolBanner';
import PoolJoinBattles from 'layout/Pool/PoolJoinBattles';
import PoolMOCBattles from 'layout/Pool/PoolMOCBattles';
import PoolProgress from 'layout/Pool/PoolProgress';
import { TypePoolMetadata } from 'types/types.pool';
import utilsSui from 'utils/utils.sui';

export default () => {
  const current_account = useCurrentAccount();

  const getPoolsFromEvents = useQuery({
    queryKey: ['pool_total'],
    queryFn: async () => {
      const { data } = await utilsSui.getSuiClient.queryEvents({
        query: {
          MoveEventType: `${utilsSui.PROGRAM.PACKAGE}::pool::PoolEvent`,
        },
      });

      return data.map(meta => meta.parsedJson) as TypePoolMetadata[];
    },
  });

  const getTicketOwner = useQuery({
    queryKey: ['ticket_owner', current_account?.address],
    queryFn: async () => {
      if (current_account?.address) {
        const { data } = await utilsSui.getSuiClient.getOwnedObjects({
          owner: current_account.address,
          filter: {
            StructType: `${utilsSui.PROGRAM.PACKAGE}::ticket::Ticket`,
          },
        });

        return data.map(meta => String(meta.data?.objectId));
      }
    },
  });

  const isJoined = getPoolsFromEvents.data?.some(
    meta => meta?.participant === current_account?.address
  );

  const isProgress = getPoolsFromEvents.data?.some(meta => meta?.begin);

  console.log(getPoolsFromEvents.data);

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
          {(getPoolsFromEvents.isLoading || getTicketOwner.isLoading) && (
            <Skeleton height="lg" />
          )}

          {!(getPoolsFromEvents.isLoading || getTicketOwner.isLoading) && (
            <>
              {isJoined && getPoolsFromEvents.data?.length && (
                <PoolMOCBattles pools={getPoolsFromEvents.data} />
              )}

              {!isJoined && (
                <PoolJoinBattles
                  getTicketOwner={getTicketOwner}
                  onSuccess={getPoolsFromEvents.refetch}
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
            isJoined={isJoined}
            isProgress={isProgress}
            onSuccess={getPoolsFromEvents.refetch}
          />
        </Box>
      </Flex>
    </Container>
  );
};
