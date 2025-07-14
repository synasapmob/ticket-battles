'use client';

import { Box, Container, Flex, Skeleton, Stack, theme } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Attention from 'components/Attention';
import Back from 'components/Back';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import useBalance from 'hook/useBalance';
import FoundryBanner from 'layout/Foundry/FoundryBanner';
import FoundrySwapChest from 'layout/Foundry/FoundrySwap/FoundrySwapChest';
import FoundrySwapIcon from 'layout/Foundry/FoundrySwap/FoundrySwapIcon';
import FoundrySwapSubmit from 'layout/Foundry/FoundrySwap/FoundrySwapSubmit';
import FoundrySwapTicket from 'layout/Foundry/FoundrySwap/FoundrySwapTicket';
import { TypeWalletEnum } from 'types';
import { formatNumber } from 'utils';
import getQueryClient from 'utils/utils.queryClient';
import utilsSui from 'utils/utils.sui';

export default () => {
  const { extension } = useExtensionContext();
  const { account } = useAccountContext();

  const balanceTicket = useBalance({
    address: account,
    options: {
      coinType: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::TICKET`,
    },
  });

  const getPriceSwapTicket = useQuery({
    queryKey: ['price_swap_ticket', extension],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        const view = await utilsSui.devInspect(
          'shared::PRICE_SWAP_TICKET_TO_GET_NFT'
        );

        return view?.length
          ? Number(
              bcs.u64().parse(bcs.byteVector().serialize(view[0][0]).parse())
            )
          : 0;
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
          {balanceTicket.isLoading && <Skeleton height="lg" />}

          {!balanceTicket.isLoading && (
            <Stack
              spacing={8}
              padding={4}
              bg="shader.a.800"
              boxShadow="0px 0px 15px 0px #00000026"
              borderRadius="xl"
              position="relative"
            >
              <Stack>
                {account ? (
                  <MyTicket amount={formatNumber(balanceTicket.data || 0)} />
                ) : null}

                <Attention>
                  spend {getPriceSwapTicket.data} tickets to forge 1 random NFT.
                  The rarity is unpredictable, test your luck!
                </Attention>
              </Stack>

              <Stack position="relative">
                <FoundrySwapIcon />

                <FoundrySwapChest
                  amount={balanceTicket.data || 0}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />

                <FoundrySwapTicket quantity={quantity} />
              </Stack>

              <FoundrySwapSubmit
                quantity={quantity}
                setQuantity={setQuantity}
                refetch={() => {
                  balanceTicket.refetch();

                  getQueryClient.refetchQueries({
                    queryKey: ['useOwnedObject', `nft::NFT/${account}`],
                  });
                }}
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
