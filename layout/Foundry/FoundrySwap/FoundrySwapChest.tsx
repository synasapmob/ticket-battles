import {
  Center,
  HStack,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import Image from 'next/image';

import ButtonMax from 'components/Button/ButtonMax';
import useDevInspect from 'hook/useDevInspect';
import MysteryWEBP from 'public/icon/mystery.webp';

interface FoundrySwapChestProps {
  amount: number;
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default ({ amount, quantity, setQuantity }: FoundrySwapChestProps) => {
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

  const getMax = Math.trunc(amount / getPriceSwapTicket);

  return (
    <Stack spacing={4} padding={4} borderRadius="xl" bg="shader.a.500">
      <Center justifyContent="space-between">
        <Text color="shader.a.200" fontWeight="medium">
          You Receive
        </Text>

        <ButtonMax
          isDisabled={!getMax}
          isLoading={getDevInspectPriceSwapTicket.isLoading}
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
