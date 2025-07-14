import { Center, HStack, Stack, Text } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { useExtensionContext } from 'components/Context/ContextExtension';
import TicketJPG from 'public/icon/ticket.jpg';
import { TypeWalletEnum } from 'types';
import utilsSui from 'utils/utils.sui';

interface FoundrySwapTicketProps {
  quantity: string | undefined;
}

export default ({ quantity }: FoundrySwapTicketProps) => {
  const { extension } = useExtensionContext();

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
            ? Number(quantity) * (getPriceSwapTicket.data || 0)
            : 0}
        </Text>
      </Center>
    </Stack>
  );
};
