'use client';

import {
  Container,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Text,
  theme,
} from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import Back from 'components/Back';
import Button3D from 'components/Button/Button3D';
import useToast from 'hook/useToast';
import MintQuantity from 'layout/Mint/MintQuantity';
import MintTime from 'layout/Mint/MintTime';
import PoolTicket from 'layout/Pool/PoolTicket';
import { TypeTicketMetadata } from 'types/types.ticket';
import { sumNumber } from 'utils';
import getQueryClient from 'utils/utils.queryClient';

export default () => {
  const current_account = useCurrentAccount();

  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState<string>();

  const toast = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ticket_get'],
    queryFn: async () => {
      const { data } = await axios.get<TypeTicketMetadata[]>('/api/ticket');

      return data;
    },
  });

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
        justifyContent="center"
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
      >
        <PoolTicket
          variant={{
            width: '30rem',
            height: '30rem',
            margin: {
              base: 'auto',
              lg: 'unset',
            },
          }}
        />

        <Stack
          spacing={6}
          flexBasis={{
            lg: '30%',
          }}
        >
          {isLoading && <Skeleton height={72} />}

          {!isLoading && (
            <>
              <MintTime />

              <Stack padding={4} bg="shader.a.700" borderRadius="lg">
                <Text color="shader.a.300">Price</Text>

                <HStack>
                  <Text
                    color="shader.a.400"
                    fontWeight="medium"
                    textDecoration="line-through"
                  >
                    0.0015 SUI
                  </Text>

                  <Text color="shader.a.100" fontWeight="bold">
                    0.2521 SUI
                  </Text>
                </HStack>
              </Stack>

              <Text fontWeight="medium">
                {data?.length ? sumNumber(data.map(meta => meta.quantity)) : 0}
                &nbsp;minted
              </Text>

              <MintQuantity quantity={quantity} setQuantity={setQuantity} />

              <Button3D
                shape="green"
                justifyContent="center"
                isDisabled={!current_account?.address}
                isLoading={loading === 'join_battle'}
                onClick={async () => {
                  try {
                    setLoading('join_battle');

                    if (!current_account) throw 'not found';

                    await axios.post('/api/ticket', {
                      owner: current_account.address,
                      quantity: Number(quantity),
                    });

                    refetch();

                    setQuantity('1');

                    getQueryClient.refetchQueries({
                      queryKey: ['ticket_put', current_account.address],
                    });

                    toast({
                      status: 'success',
                      description: 'Minted successfully',
                    });
                  } finally {
                    setLoading(undefined);
                  }
                }}
              >
                Mint
              </Button3D>
            </>
          )}
        </Stack>
      </Flex>
    </Container>
  );
};
