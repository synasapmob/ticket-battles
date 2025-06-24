import {
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useState } from 'react';

import Button3D from 'components/Button/Button3D';
import useBalance from 'hook/useBalance';
import useOwnedObject from 'hook/useOwnedObject';
import useToast from 'hook/useToast';
import PoolTicket from 'layout/Pool/PoolTicket';
import SuiIcon from 'public/fill/sui.svg';
import { formatNumberDecimal, waitForSeconds } from 'utils';
import utilsSui from 'utils/utils.sui';

interface MintSubmitProps {
  getPriceMint: number;
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  refetch: () => void;
}

export default ({
  getPriceMint,
  quantity,
  setQuantity,
  refetch,
}: MintSubmitProps) => {
  const current_account = useCurrentAccount();
  const balance = useBalance(current_account?.address);
  const signTransaction = useSignAndExecuteTransaction();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const toast = useToast();

  const ticketOwnedObject = useOwnedObject({
    queryKey: `ticket::Ticket/${current_account?.address}`,
    input: {
      owner: current_account?.address as string,
      filter: {
        StructType: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::Ticket`,
      },
      options: {
        showContent: true,
      },
    },
  });

  const [loading, setLoading] = useState<string>();

  const totalPrice = BigNumber(getPriceMint)
    .multipliedBy(Number(quantity) || 0)
    .toNumber();

  const insufficientBalance = totalPrice > (balance?.data || 0);

  return (
    <>
      <Button3D
        shape="green"
        justifyContent="center"
        isDisabled={!current_account?.address || insufficientBalance}
        isLoading={
          loading === 'join_battle' ||
          balance.isLoading ||
          ticketOwnedObject.isLoading
        }
        onClick={onToggle}
      >
        {(function () {
          if (insufficientBalance) {
            return 'Insufficient Balance';
          }

          return 'Mint';
        })()}
      </Button3D>

      <Modal isOpen={isOpen} onClose={onClose} variant="shadow">
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            <Center justifyContent="space-between">
              <Text color="white" fontWeight="bold">
                Mint
              </Text>

              <ModalCloseButton position="unset" />
            </Center>
          </ModalHeader>

          <ModalBody padding={4}>
            <Stack>
              <PoolTicket
                variant={{
                  margin: 'auto',
                }}
              />

              <Center padding={4} justifyContent="space-between">
                <Text>Quantity</Text>

                <Text>x{quantity}</Text>
              </Center>

              <Center
                padding={4}
                borderRadius="lg"
                bg="secondary.green.1"
                justifyContent="space-between"
              >
                <Text>Total Price</Text>

                <HStack>
                  <Text>{formatNumberDecimal(totalPrice)}</Text>

                  <Icon as={SuiIcon} width={4} height={4} />
                </HStack>
              </Center>

              <Button
                variant="dark"
                bg="shader.a.500"
                justifyContent="center"
                mt={4}
                height={10}
                isLoading={loading === 'join_battle'}
                onClick={async () => {
                  try {
                    setLoading('join_battle');

                    if (!current_account) throw 'not found';

                    const tx = new Transaction();

                    const coin = tx.splitCoins(tx.gas, [totalPrice]);

                    tx.moveCall({
                      target: (function () {
                        if (ticketOwnedObject.data?.length) {
                          return `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::mint_with_amount`;
                        }

                        return `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::mint`;
                      })(),
                      arguments: (function () {
                        if (ticketOwnedObject.data?.length) {
                          return [
                            tx.object(ticketOwnedObject.data[0].objectId),
                            coin,
                          ];
                        }

                        return [coin];
                      })(),
                    });

                    await signTransaction.mutateAsync({
                      transaction: tx as unknown as string,
                    });

                    await waitForSeconds(() => {
                      refetch();

                      ticketOwnedObject.refetch();
                    });

                    setQuantity('1');
                    onClose();
                    toast({
                      status: 'success',
                      description: 'Minted successfully',
                    });
                  } finally {
                    setLoading(undefined);
                  }
                }}
              >
                Confirm
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
