'use client';

import { Box, Container, Flex, Skeleton, Stack, theme } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
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
import { formatNumber } from 'utils';
import utilsSui from 'utils/utils.sui';

export default () => {
  const current_account = useCurrentAccount();

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

  const [quantity, setQuantity] = useState<string>();

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
          {getTicketOwner.isLoading && <Skeleton height="lg" />}

          {!getTicketOwner.isLoading && (
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
                  <MyTicket
                    amount={
                      getTicketOwner.data
                        ? formatNumber(getTicketOwner.data.length)
                        : 0
                    }
                  />
                ) : null}

                <Attention>
                  spend 10 tickets to forge 1 random NFT. The rarity is
                  unpredictable, test your luck!
                </Attention>
              </Stack>

              <Stack position="relative">
                <FoundrySwapIcon />

                <FoundrySwapChest
                  amount={getTicketOwner.data ? getTicketOwner.data.length : 0}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />

                <FoundrySwapTicket quantity={quantity} />
              </Stack>

              <FoundrySwapSubmit
                getTicketOwner={getTicketOwner}
                quantity={quantity}
                setQuantity={setQuantity}
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
