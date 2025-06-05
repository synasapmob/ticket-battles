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
import useToast from 'hook/useToast';
import PoolTicket from 'layout/Pool/PoolTicket';
import SuiIcon from 'public/fill/sui.svg';
import { formatNumberDecimal, waitForSeconds } from 'utils';
import utilsConstants from 'utils/utils.constants';
import utilsSui from 'utils/utils.sui';

interface MintSubmitProps {
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  refetch: () => void;
}

export default ({ quantity, setQuantity, refetch }: MintSubmitProps) => {
  const current_account = useCurrentAccount();
  const balance = useBalance(current_account?.address);
  const signTransaction = useSignAndExecuteTransaction();

  const [loading, setLoading] = useState<string>();
  const toast = useToast();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const totalPrice = BigNumber(utilsConstants.PRICE_MINT)
    .multipliedBy(Number(quantity) || 0)
    .multipliedBy(utilsConstants.DECIMAL)
    .toNumber();

  const insufficientBalance = totalPrice > (balance?.data || 0);

  return (
    <>
      <Button3D
        shape="green"
        justifyContent="center"
        isDisabled={!current_account?.address || insufficientBalance}
        isLoading={loading === 'join_battle' || balance.isLoading}
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

                    tx.moveCall({
                      target: `${utilsSui.PROGRAM.PACKAGE}::ticket::mint`,
                      arguments: [tx.splitCoins(tx.gas, [totalPrice])],
                    });

                    await signTransaction.mutateAsync({
                      transaction: tx,
                    });

                    await waitForSeconds(() => {
                      refetch();
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
