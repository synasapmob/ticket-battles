import { Skeleton, Stack, Text } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Attention from 'components/Attention';
import Button3D from 'components/Button/Button3D';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import PoolTicket from 'layout/Pool/PoolTicket';
import { TypeNFTMetadata } from 'types/types.nft';
import utilsSui from 'utils/utils.sui';
interface PoolJoinBattlesProps {
  setJoin: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default ({ setJoin }: PoolJoinBattlesProps) => {
  const current_account = useCurrentAccount();

  const [loading, setLoading] = useState<string>();

  const { data, isLoading } = useQuery({
    queryKey: ['profile', current_account?.address],
    queryFn: async () => {
      if (current_account?.address) {
        const nfts = await utilsSui.getSuiClient.getOwnedObjects({
          owner: current_account.address,
          filter: {
            Package: utilsSui.PACKAGE_ID,
          },
          options: {
            showContent: true,
          },
        });

        const parse = nfts.data.map(meta => meta.data?.content) as unknown as {
          fields: TypeNFTMetadata;
        }[];

        return parse;
      }
    },
  });

  return (
    <>
      {isLoading && <Skeleton height="lg" />}

      {!isLoading && (
        <Stack
          spacing={8}
          padding={4}
          bg="shader.a.800"
          borderRadius="xl"
          boxShadow="0px 0px 15px 0px #00000026"
          position="relative"
        >
          <Stack>
            <MyTicket amount={data?.length || 0} />

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
              isDisabled={!current_account?.address || !data?.length}
              isLoading={loading === 'join_battle' || isLoading}
              onClick={async () => {
                try {
                  setLoading('join_battle');

                  await new Promise(resolve => {
                    setTimeout(() => resolve('hi'), 500);
                  });

                  setJoin(true);
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
