import { Skeleton, Stack, Text } from '@chakra-ui/react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

import Attention from 'components/Attention';
import Button3D from 'components/Button/Button3D';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import useOwnedObject from 'hook/useOwnedObject';
import PoolTicket from 'layout/Pool/PoolTicket';
import { TypeOwnedObjectSuiParsedData } from 'types';
import { TypePoolEventPool } from 'types/types.pool';
import { TypeTicketContentField } from 'types/types.ticket';
import { formatNumber, waitForSeconds } from 'utils';
import getQueryClient from 'utils/utils.queryClient';
import utilsSui from 'utils/utils.sui';

interface PoolJoinBattlesProps {
  getEnoughParticipants: number;
}

export default ({ getEnoughParticipants }: PoolJoinBattlesProps) => {
  const signTransaction = useSignAndExecuteTransaction();
  const current_account = useCurrentAccount();

  const [loading, setLoading] = useState<string>();

  const ticketOwnedObject = useOwnedObject<
    TypeOwnedObjectSuiParsedData<TypeTicketContentField>
  >({
    queryKey: `ticket::Ticket/${current_account?.address}`,
    input: {
      owner: current_account?.address as string,
      filter: {
        StructType: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::Ticket`,
      },
      options: {
        showContent: true,
      },
    },
  });

  const ticketTotalAmount = Number(
    ticketOwnedObject.data?.[0]?.content?.fields?.amount || 0
  );

  return (
    <>
      {ticketOwnedObject.isLoading && <Skeleton height="lg" />}

      {!ticketOwnedObject.isLoading && (
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
              isDisabled={!current_account?.address || !ticketTotalAmount}
              isLoading={
                loading === 'join_battle' || ticketOwnedObject.isLoading
              }
              onClick={async () => {
                try {
                  setLoading('join_battle');

                  if (
                    !current_account?.address ||
                    !ticketOwnedObject.data?.length
                  ) {
                    throw 'not found';
                  }

                  const tx = new Transaction();

                  tx.moveCall({
                    target: `${utilsSui.PROGRAM.PACKAGE_ID}::pool::join`,
                    arguments: [
                      tx.object(utilsSui.PROGRAM.POOL_ID),
                      tx.object(utilsSui.PROGRAM.COLLECTION_ID),
                      tx.object(ticketOwnedObject.data[0].objectId),
                      tx.object.random(),
                    ],
                  });

                  const { digest } = await signTransaction.mutateAsync({
                    transaction: tx as unknown as string,
                  });

                  const result = await utilsSui.getSuiClient.waitForTransaction(
                    {
                      digest: digest,
                      options: {
                        showEvents: true,
                      },
                    }
                  );

                  const event = result.events?.[0]
                    .parsedJson as TypePoolEventPool;

                  // refetch
                  {
                    await getQueryClient.setQueryData(
                      ['useQueryEvent', 'pool::PoolEvent'],
                      ([argument]: [TypePoolEventPool]): [
                        TypePoolEventPool,
                      ] => {
                        const instance = {
                          participants: [
                            current_account.address,
                            ...(argument?.participants || []),
                          ],
                          winner: event?.winner,
                        };

                        fetch('/api/pool', {
                          method: 'POST',
                          body: JSON.stringify(instance),
                        });

                        return [instance];
                      }
                    );

                    await waitForSeconds(() => {
                      ticketOwnedObject.refetch();
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
