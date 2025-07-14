'use client';

import {
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
  theme,
} from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Back from 'components/Back';
import { useExtensionContext } from 'components/Context/ContextExtension';
import Currency from 'components/Currency';
import MintQuantity from 'layout/Mint/MintQuantity';
import MintSubmit from 'layout/Mint/MintSubmit';
import MintTime from 'layout/Mint/MintTime';
import PoolTicket from 'layout/Pool/PoolTicket';
import { TypeWalletEnum } from 'types';
import { TypeTicketContentField } from 'types/types.ticket';
import { formatNumber, formatNumberDecimal, sumNumber } from 'utils';
import utilsConstants from 'utils/utils.constants';
import utilsSui from 'utils/utils.sui';

export default () => {
  const { extension } = useExtensionContext();

  const [quantity, setQuantity] = useState('1');

  const getTicketEvent = useQuery({
    queryKey: ['minted', extension],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        const { data } = await utilsSui.getSuiClient.queryEvents({
          query: {
            MoveEventType: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::TicketEvent`,
          },
        });

        const parsedJSON = data.map(
          meta => meta.parsedJson as TypeTicketContentField
        );

        return sumNumber(parsedJSON.map(meta => Number(meta.amount)));
      }
    },
  });

  const getPriceMint = useQuery({
    queryKey: ['price_mint_ticket', extension],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        const view = await utilsSui.devInspect('shared::PRICE_MINT_TICKET');

        return view?.length
          ? Number(
              bcs.u64().parse(bcs.byteVector().serialize(view[0][0]).parse())
            )
          : 0;
      }
    },
  });

  const config = utilsConstants.WALLET_CONFIG.find(
    meta => meta.extension === extension
  );

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
          {(getTicketEvent.isLoading || getPriceMint.isLoading) && (
            <Skeleton height={72} />
          )}

          {!(getTicketEvent.isLoading || getPriceMint.isLoading) && (
            <>
              <MintTime />

              <Stack padding={4} bg="shader.a.700" borderRadius="lg">
                <Text color="shader.a.300">Price</Text>

                <Currency
                  price={formatNumberDecimal(
                    getPriceMint.data || 0,
                    config?.decimal
                  )}
                  symbol={config?.symbol}
                />
              </Stack>

              <Text fontWeight="medium">
                {formatNumber(getTicketEvent.data || 0)}
                &nbsp;minted
              </Text>

              <MintQuantity quantity={quantity} setQuantity={setQuantity} />

              <MintSubmit
                getPriceMint={getPriceMint.data || 0}
                quantity={quantity}
                setQuantity={setQuantity}
                refetch={getTicketEvent.refetch}
              />
            </>
          )}
        </Stack>
      </Flex>
    </Container>
  );
};
