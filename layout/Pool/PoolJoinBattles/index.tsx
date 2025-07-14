import { Skeleton, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Attention from 'components/Attention';
import Button3D from 'components/Button/Button3D';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import PoolTicket from 'layout/Pool/PoolTicket';
import { TypeOwnedObjectSuiParsedData, TypeWalletEnum } from 'types';
import { TypePoolEventPool } from 'types/types.pool';
import { TypeTicketContentField } from 'types/types.ticket';
import { catchProperties, formatNumber, waitForSeconds } from 'utils';
import getQueryClient from 'utils/utils.queryClient';
import utilsSui from 'utils/utils.sui';

interface PoolJoinBattlesProps {
  getEnoughParticipants: number;
}

export default ({ getEnoughParticipants }: PoolJoinBattlesProps) => {
  const { extension } = useExtensionContext();
  const { account } = useAccountContext();

  const [loading, setLoading] = useState<string>();

  const getMyTickets = useQuery({
    queryKey: ['my_tickets', extension, account],
    queryFn: async () => {
      if (account && extension === TypeWalletEnum.Slush) {
        return await utilsSui.getOwnedObject<
          TypeOwnedObjectSuiParsedData<TypeTicketContentField>
        >({
          type: 'ticket::Ticket',
          options: {
            owner: account,
          },
        });
      }
    },
  });

  const ticketTotalAmount = Number(
    getMyTickets.data?.[0]?.content?.fields?.amount || 0
  );

  return (
    <>
      {getMyTickets.isLoading && <Skeleton height="lg" />}

      {!getMyTickets.isLoading && (
        <Stack
          spacing={8}
          padding={4}
          bg="shader.a.800"
          borderRadius="xl"
          boxShadow="0px 0px 15px 0px #00000026"
          position="relative"
        >
          <Stack>
            <MyTicket amount={formatNumber(ticketTotalAmount)} />

            <Attention>
              Use 1 ticket to enter the pool. The battle will automatically
              start once {getEnoughParticipants} tickets are collected.
            </Attention>
          </Stack>

          <Stack spacing={6} alignItems="center">
            <Stack>
              <PoolTicket
                variant={{
                  borderRadius: 'xl',
                }}
              />

              <Text textAlign="center" color="white" fontWeight="bold">
                X1
              </Text>
            </Stack>

            <Button3D
              shape="purple"
              justifyContent="center"
              px={6}
              isDisabled={!account || !ticketTotalAmount}
              isLoading={loading === 'join_battle' || getMyTickets.isLoading}
              onClick={async () => {
                try {
                  setLoading('join_battle');

                  if (!account || !getMyTickets.data?.length) {
                    throw catchProperties({
                      account,
                      getMyTickets,
                    });
                  }

                  let winner: string | null | undefined = null;

                  if (extension === TypeWalletEnum.Slush) {
                    const tx = utilsSui.transaction();

                    tx.moveCall({
                      target: `${utilsSui.PROGRAM.PACKAGE_ID}::pool::join`,
                      arguments: [
                        tx.object(utilsSui.PROGRAM.POOL_ID),
                        tx.object(utilsSui.PROGRAM.COLLECTION_ID),
                        tx.object(getMyTickets.data[0].objectId),
                        tx.object.random(),
                      ],
                    });

                    const { digest } =
                      await utilsSui.signAndExecuteTransaction(tx);

                    // looking for winner
                    {
                      const result =
                        await utilsSui.getSuiClient.waitForTransaction({
                          digest: digest,
                          options: {
                            showEvents: true,
                          },
                        });

                      const event = result.events?.[0]
                        .parsedJson as TypePoolEventPool;

                      winner = event?.winner;
                    }
                  }

                  // refetch
                  {
                    await getQueryClient.setQueryData(
                      ['useQueryEvent', 'pool::PoolEvent'],
                      ([argument]: [TypePoolEventPool]): [
                        TypePoolEventPool,
                      ] => {
                        const instance = {
                          participants: [
                            account,
                            ...(argument?.participants || []),
                          ],
                          winner,
                        };

                        fetch('/api/pool', {
                          method: 'POST',
                          body: JSON.stringify(instance),
                        });

                        return [instance];
                      }
                    );

                    await waitForSeconds(() => {
                      getMyTickets.refetch();
                    });
                  }
                } finally {
                  setLoading(undefined);
                }
              }}
            >
              Join Battle
            </Button3D>
          </Stack>

          <Radial
            bg="radial-gradient(50% 100% at 50% 100%, rgba(151, 71, 255, 0.1) 0%, rgba(151, 71, 255, 0) 100%)"
            bottom={0}
          />
        </Stack>
      )}
    </>
  );
};
