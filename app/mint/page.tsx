'use client';

import {
  Container,
  Flex,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  theme,
} from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useState } from 'react';

import Back from 'components/Back';
import useDevInspect from 'hook/useDevInspect';
import useQueryEvent from 'hook/useQueryEvent';
import MintQuantity from 'layout/Mint/MintQuantity';
import MintSubmit from 'layout/Mint/MintSubmit';
import MintTime from 'layout/Mint/MintTime';
import PoolTicket from 'layout/Pool/PoolTicket';
import SuiIcon from 'public/fill/sui.svg';
import { TypeTicketContentField } from 'types/types.ticket';
import { formatNumber, formatNumberDecimal, sumNumber } from 'utils';

export default () => {
  const [quantity, setQuantity] = useState('1');

  const getTicketEvent = useQueryEvent<TypeTicketContentField>({
    type: 'ticket::TicketEvent',
  });

  const getDevInspectPriceMint = useDevInspect({
    type: 'shared::PRICE_MINT_TICKET',
  });

  const getPriceMint = getDevInspectPriceMint.data?.length
    ? Number(
        bcs
          .u64()
          .parse(
            bcs
              .byteVector()
              .serialize(getDevInspectPriceMint.data[0][0])
              .parse()
          )
      )
    : 0;

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
          {(getTicketEvent.isLoading || getDevInspectPriceMint.isLoading) && (
            <Skeleton height={72} />
          )}

          {!(getTicketEvent.isLoading || getDevInspectPriceMint.isLoading) && (
            <>
              <MintTime />

              <Stack padding={4} bg="shader.a.700" borderRadius="lg">
                <Text color="shader.a.300">Price</Text>

                <HStack>
                  <Text color="shader.a.100" fontWeight="bold">
                    {formatNumberDecimal(getPriceMint)} SUI
                  </Text>

                  <Icon as={SuiIcon} width={4} height={4} />
                </HStack>
              </Stack>

              <Text fontWeight="medium">
                {formatNumber(
                  getTicketEvent.data?.length
                    ? sumNumber(
                        getTicketEvent.data.map(meta => Number(meta.amount))
                      )
                    : 0
                )}
                &nbsp;minted
              </Text>

              <MintQuantity quantity={quantity} setQuantity={setQuantity} />

              <MintSubmit
                getPriceMint={getPriceMint}
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
