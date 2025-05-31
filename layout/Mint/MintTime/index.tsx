import { Box, HStack, Text } from '@chakra-ui/react';

import useCounter from 'hook/useCounter';
import colors from 'theme/colors';
import { convertHex } from 'utils';

export default () => {
  const { display } = useCounter({
    date: 1748845325216,
    onSuccess: async () => {},
  });

  return (
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
  );
};
