'use client';

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  theme,
} from '@chakra-ui/react';
import { useState } from 'react';

import Back from 'components/Back';
import Button3D from 'components/Button/Button3D';
import useCounter from 'hook/useCounter';
import MintQuantity from 'layout/Mint/MintQuantity';
import PoolTicket from 'layout/Pool/PoolTicket';
import SparkleIcon from 'public/fill/sparkle.svg';
import colors from 'theme/colors';
import { convertHex } from 'utils';
import utilsConstants from 'utils/utils.constants';

export default () => {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState<string>();

  const { display } = useCounter({
    date: 1748845325216,
    onSuccess: async () => {},
  });

  console.log(display);

  return (
    <Container
      maxWidth={theme.breakpoints.xl}
      display="flex"
      flexDirection="column"
      mt={6}
      gap={6}
    >
      <Back />

      <Heading color="accents.yellow" fontSize="xl" fontWeight="bold">
        Mint
      </Heading>

      <Flex gap={4} justifyContent="center">
        <PoolTicket
          variant={{
            width: '30rem',
            height: '30rem',
          }}
        />

        <Stack spacing={6}>
          <HStack
            bg={convertHex(colors.secondary.green[1], 0.1)}
            justifyContent="flex-start"
            borderRadius="lg"
            padding={4}
          >
            <Box
              minWidth={2}
              height={2}
              borderRadius="lg"
              bg="secondary.green.2"
              position="relative"
              boxShadow={`0px 0px 10px 2px ${convertHex(
                colors.secondary.green[1],
                0.1
              )}`}
              sx={{
                animation: 'minting-opacity 1.2s infinite',

                '@keyframes minting-opacity': {
                  '0%': {
                    opacity: 0.5,
                  },
                  '50%': {
                    opacity: 1,
                  },
                  '100%': {
                    opacity: 0.5,
                  },
                },
              }}
            />

            <Text color="shader.a.100">
              Minting ends in&nbsp;
              <Text as="span" fontWeight="bold">
                {display}
              </Text>
            </Text>
          </HStack>

          <Stack padding={4} bg="shader.a.700" borderRadius="lg">
            <Text
              width="fit-content"
              bg="linear.g.4"
              display="flex"
              sx={{
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <Icon as={SparkleIcon} width={5} height={5} />
              &nbsp;Up to {utilsConstants.DISCOUNT}% discount!
            </Text>

            <Text>Top 10 on the leaderboard can mint for just 0.0015 SUI.</Text>
          </Stack>

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

          <HStack>
            <MintQuantity quantity={quantity} setQuantity={setQuantity} />

            <Button3D
              flex={1}
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
          </HStack>
        </Stack>
      </Flex>
    </Container>
  );
};
