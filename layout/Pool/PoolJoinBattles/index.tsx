import { Skeleton, Stack, Text } from '@chakra-ui/react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';

import Attention from 'components/Attention';
import Button3D from 'components/Button/Button3D';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import PoolTicket from 'layout/Pool/PoolTicket';
import { formatNumber, waitForSeconds } from 'utils';
import utilsSui from 'utils/utils.sui';

interface PoolJoinBattlesProps {
  getTicketOwner: UseQueryResult<string[] | undefined, Error>;
  onSuccess: () => void;
}

export default ({ getTicketOwner, onSuccess }: PoolJoinBattlesProps) => {
  const signTransaction = useSignAndExecuteTransaction();
  const current_account = useCurrentAccount();

  const [loading, setLoading] = useState<string>();

  return (
    <>
      {getTicketOwner.isLoading && <Skeleton height="lg" />}

      {!getTicketOwner.isLoading && (
        <Stack
          spacing={8}
          padding={4}
          bg="shader.a.800"
          borderRadius="xl"
          boxShadow="0px 0px 15px 0px #00000026"
          position="relative"
        >
          <Stack>
            <MyTicket amount={formatNumber(getTicketOwner.data?.length || 0)} />

            <Attention>
              Use 1 ticket to enter the pool. The battle will automatically
              start once 10 tickets are collected.
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
              isDisabled={
                !current_account?.address || !getTicketOwner.data?.length
              }
              isLoading={loading === 'join_battle' || getTicketOwner.isLoading}
              onClick={async () => {
                try {
                  setLoading('join_battle');

                  if (
                    !current_account?.address ||
                    !getTicketOwner.data?.length
                  ) {
                    throw 'not found';
                  }

                  const tx = new Transaction();

                  tx.moveCall({
                    target: `${utilsSui.PROGRAM.PACKAGE}::pool::join`,
                    arguments: [
                      tx.object(utilsSui.PROGRAM.POOL),
                      tx.object(utilsSui.PROGRAM.COLLECTION),
                      tx.object(getTicketOwner.data[0]),
                      //                       _pool: &mut Pool,
                      // _collection: &mut nft::Collection,
                      // _ticket: Ticket,
                    ],
                  });

                  await signTransaction.mutateAsync({
                    transaction: tx,
                  });

                  await waitForSeconds(() => {
                    onSuccess();
                    getTicketOwner.refetch();
                  });
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
