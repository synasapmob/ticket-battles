'use client';

import { Box, Container, Flex, Skeleton, Stack, theme } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import Attention from 'components/Attention';
import Back from 'components/Back';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import FoundryBanner from 'layout/Foundry/FoundryBanner';
import FoundrySwapChest from 'layout/Foundry/FoundrySwap/FoundrySwapChest';
import FoundrySwapIcon from 'layout/Foundry/FoundrySwap/FoundrySwapIcon';
import FoundrySwapSubmit from 'layout/Foundry/FoundrySwap/FoundrySwapSubmit';
import FoundrySwapTicket from 'layout/Foundry/FoundrySwap/FoundrySwapTicket';
import { TypeTicketMetadata } from 'types/types.ticket';

export default () => {
  const current_account = useCurrentAccount();

  const [quantity, setQuantity] = useState<string>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ticket_put', current_account?.address],
    queryFn: async () => {
      if (current_account?.address) {
        const { data } = await axios.put<TypeTicketMetadata>('/api/ticket', {
          owner: current_account.address,
        });

        return data;
      }
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
            <Stack
              spacing={8}
              padding={4}
              bg="shader.a.800"
              boxShadow="0px 0px 15px 0px #00000026"
              borderRadius="xl"
              position="relative"
            >
              <Stack>
                {current_account?.address ? (
                  <MyTicket amount={data ? data.quantity : 0} />
                ) : null}

                <Attention>
                  spend 10 tickets to forge 1 random NFT. The rarity is
                  unpredictable, test your luck!
                </Attention>
              </Stack>

              <Stack position="relative">
                <FoundrySwapIcon />

                <FoundrySwapChest
                  amount={data ? data.quantity : 0}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />

                <FoundrySwapTicket quantity={quantity} />
              </Stack>

              <FoundrySwapSubmit
                quantity={quantity}
                setQuantity={setQuantity}
                refetch={refetch}
              />

              <Radial
                bg="radial-gradient(50% 100% at 50% 100%, rgba(196, 255, 195, 0.1) 0%, rgba(196, 255, 195, 0) 100%)"
                bottom={0}
              />
            </Stack>
          )}
        </Box>

        <FoundryBanner />
      </Flex>
    </Container>
  );
};
