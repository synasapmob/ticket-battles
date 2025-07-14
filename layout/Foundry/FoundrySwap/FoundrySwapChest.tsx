import {
  Center,
  HStack,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import ButtonMax from 'components/Button/ButtonMax';
import { useExtensionContext } from 'components/Context/ContextExtension';
import MysteryWEBP from 'public/icon/mystery.webp';
import { TypeWalletEnum } from 'types';
import utilsSui from 'utils/utils.sui';

interface FoundrySwapChestProps {
  amount: number;
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default ({ amount, quantity, setQuantity }: FoundrySwapChestProps) => {
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

  const getMax = Math.trunc(amount / (getPriceSwapTicket?.data || 0));

  return (
    <Stack spacing={4} padding={4} borderRadius="xl" bg="shader.a.500">
      <Center justifyContent="space-between">
        <Text color="shader.a.200" fontWeight="medium">
          You Receive
        </Text>

        <ButtonMax
          isDisabled={!getMax}
          isLoading={getPriceSwapTicket.isLoading}
          onClick={() => {
            if (getMax) {
              setQuantity(String(getMax));
            }
          }}
        />
      </Center>

      <Center justifyContent="space-between">
        <HStack spacing={3}>
          <Image
            src={MysteryWEBP.src}
            alt={MysteryWEBP.src}
            width={56}
            height={56}
          />

          <Text color="white" fontWeight="bold" fontSize="xl">
            Mystery
          </Text>
        </HStack>

        <NumberInput
          variant="unstyled"
          isDisabled={!getMax}
          width={20}
          min={1}
          max={getMax}
          value={quantity}
          onChange={event => setQuantity(event)}
        >
          <NumberInputField
            padding={0}
            textAlign="right"
            color="white"
            fontWeight="bold"
            fontSize="2xl"
            placeholder="0"
            _placeholder={{
              color: 'shader.a.400',
            }}
          />
        </NumberInput>
      </Center>
    </Stack>
  );
};
