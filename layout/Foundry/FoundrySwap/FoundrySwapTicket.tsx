import { Center, HStack, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

import TicketJPG from 'public/icon/ticket.jpg';
import utilsConstants from 'utils/utils.constants';

interface FoundrySwapTicketProps {
  quantity: string | undefined;
}

export default ({ quantity }: FoundrySwapTicketProps) => {
  return (
    <Stack spacing={4} padding={4} borderRadius="xl" bg="shader.a.500">
      <Text color="shader.a.200" fontWeight="medium">
        You pay
      </Text>

      <Center justifyContent="space-between">
        <HStack spacing={3}>
          <Image
            src={TicketJPG.src}
            alt={TicketJPG.src}
            width={56}
            height={56}
          />

          <Text color="white" fontWeight="bold" fontSize="xl">
            Ticket
          </Text>
        </HStack>

        <Text color="white" fontWeight="bold" fontSize="2xl">
          {(Number(quantity) || 0) >= 1
            ? Number(quantity) * utilsConstants.SWAP_TICKET
            : 0}
        </Text>
      </Center>
    </Stack>
  );
};
