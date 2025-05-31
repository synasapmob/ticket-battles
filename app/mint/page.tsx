'use client';

import { Container, Flex, HStack, Stack, Text, theme } from '@chakra-ui/react';
import { useState } from 'react';

import Back from 'components/Back';
import Button3D from 'components/Button/Button3D';
import MintQuantity from 'layout/Mint/MintQuantity';
import MintTime from 'layout/Mint/MintTime';
import PoolTicket from 'layout/Pool/PoolTicket';

export default () => {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState<string>();

  return (
    <Container
      maxWidth={theme.breakpoints.xl}
      display="flex"
      flexDirection="column"
      my={6}
      gap={6}
    >
      <Back />

      <Flex gap={4} justifyContent="center">
        <PoolTicket
          variant={{
            width: '30rem',
            height: '30rem',
          }}
        />

        <Stack spacing={6} flexBasis="30%">
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

              <Text color="shader.a.100">0.2521 SUI</Text>
            </HStack>
          </Stack>

          <Text>15,000 minted</Text>

          <MintQuantity quantity={quantity} setQuantity={setQuantity} />

          <Button3D
            shape="green"
            justifyContent="center"
            isLoading={loading === 'join_battle'}
            onClick={async () => {
              try {
                setLoading('join_battle');

                await new Promise(resolve => {
                  setTimeout(() => resolve('hi'), 500);
                });
              } finally {
                setLoading(undefined);
              }
            }}
          >
            Mint
          </Button3D>
        </Stack>
      </Flex>
    </Container>
  );
};
