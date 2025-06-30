'use client';

import { Box, Container, Flex, Skeleton, Stack, theme } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

import Attention from 'components/Attention';
import Back from 'components/Back';
import MyTicket from 'components/MyTicket';
import Radial from 'components/Radial';
import useDevInspect from 'hook/useDevInspect';
import useOwnedObject from 'hook/useOwnedObject';
import FoundryBanner from 'layout/Foundry/FoundryBanner';
import FoundrySwapChest from 'layout/Foundry/FoundrySwap/FoundrySwapChest';
import FoundrySwapIcon from 'layout/Foundry/FoundrySwap/FoundrySwapIcon';
import FoundrySwapSubmit from 'layout/Foundry/FoundrySwap/FoundrySwapSubmit';
import FoundrySwapTicket from 'layout/Foundry/FoundrySwap/FoundrySwapTicket';
import { TypeOwnedObjectSuiParsedData } from 'types';
import { TypeTicketContentField } from 'types/types.ticket';
import { formatNumber } from 'utils';
import getQueryClient from 'utils/utils.queryClient';
import utilsSui from 'utils/utils.sui';

export default () => {
  const current_account = useCurrentAccount();

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

  const getDevInspectPriceSwapTicket = useDevInspect({
    type: 'shared::PRICE_SWAP_TICKET_TO_GET_NFT',
  });

  const getPriceSwapTicket = getDevInspectPriceSwapTicket.data?.length
    ? Number(
        bcs
          .u64()
          .parse(
            bcs
              .byteVector()
              .serialize(getDevInspectPriceSwapTicket.data[0][0])
              .parse()
          )
      )
    : 0;

  const ticketTotalAmount = Number(
    ticketOwnedObject.data?.[0]?.content?.fields?.amount || 0
  );

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
          {ticketOwnedObject.isLoading && <Skeleton height="lg" />}

          {!ticketOwnedObject.isLoading && (
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
                  <MyTicket amount={formatNumber(ticketTotalAmount)} />
                ) : null}

                <Attention>
                  spend {getPriceSwapTicket} tickets to forge 1 random NFT. The
                  rarity is unpredictable, test your luck!
                </Attention>
              </Stack>

              <Stack position="relative">
                <FoundrySwapIcon />

                <FoundrySwapChest
                  amount={ticketTotalAmount}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />

                <FoundrySwapTicket quantity={quantity} />
              </Stack>

              <FoundrySwapSubmit
                ticketOwnedObject={ticketOwnedObject.data?.[0]?.objectId}
                quantity={quantity}
                setQuantity={setQuantity}
                refetch={() => {
                  ticketOwnedObject.refetch();

                  getQueryClient.refetchQueries({
                    queryKey: [
                      'useOwnedObject',
                      `nft::NFT/${current_account?.address}`,
                    ],
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
