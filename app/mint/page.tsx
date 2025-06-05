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
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Back from 'components/Back';
import MintQuantity from 'layout/Mint/MintQuantity';
import MintSubmit from 'layout/Mint/MintSubmit';
import MintTime from 'layout/Mint/MintTime';
import PoolTicket from 'layout/Pool/PoolTicket';
import SuiIcon from 'public/fill/sui.svg';
import { formatNumber } from 'utils';
import utilsConstants from 'utils/utils.constants';
import utilsSui from 'utils/utils.sui';

export default () => {
  const [quantity, setQuantity] = useState('1');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ticket_total'],
    queryFn: async () => {
      const { data } = await utilsSui.getSuiClient.queryEvents({
        query: {
          MoveEventType: `${utilsSui.PROGRAM.PACKAGE}::ticket::TicketEvent`,
        },
      });

      return data.length;
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
                  <Text color="shader.a.100" fontWeight="bold">
                    {utilsConstants.PRICE_MINT} SUI
                  </Text>

                  <Icon as={SuiIcon} width={4} height={4} />
                </HStack>
              </Stack>

              <Text fontWeight="medium">
                {formatNumber(data || 0)}
                &nbsp;minted
              </Text>

              <MintQuantity quantity={quantity} setQuantity={setQuantity} />

              <MintSubmit
                quantity={quantity}
                setQuantity={setQuantity}
                refetch={refetch}
              />
            </>
          )}
        </Stack>
      </Flex>
    </Container>
  );
};
