import { Center, HStack, Stack, Text } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import Image from 'next/image';

import useDevInspect from 'hook/useDevInspect';
import TicketJPG from 'public/icon/ticket.jpg';

interface FoundrySwapTicketProps {
  quantity: string | undefined;
}

export default ({ quantity }: FoundrySwapTicketProps) => {
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
            ? Number(quantity) * getPriceSwapTicket
            : 0}
        </Text>
      </Center>
    </Stack>
  );
};
