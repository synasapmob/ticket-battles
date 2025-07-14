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
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useState } from 'react';

import Button3D from 'components/Button/Button3D';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import useBalance from 'hook/useBalance';
import useToast from 'hook/useToast';
import PoolTicket from 'layout/Pool/PoolTicket';
import SuiIcon from 'public/fill/sui.svg';
import { TypeWalletEnum } from 'types';
import { catchProperties, formatNumberDecimal, waitForSeconds } from 'utils';
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
  const { account } = useAccountContext();
  const { extension } = useExtensionContext();

  const balance = useBalance({
    address: account,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();

  const toast = useToast();

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
        isDisabled={!account || insufficientBalance}
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

                    if (!account) {
                      throw catchProperties({
                        account,
                      });
                    }

                    if (extension === TypeWalletEnum.Slush) {
                      const tx = utilsSui.transaction();

                      const coin_sui = tx.splitCoins(tx.gas, [totalPrice]);
                      const coin_ticket = tx.splitCoins(
                        '0x7e1385925985b0efd22216997f7499771227b4406d45437be71d6d3b8aa8a690',
                        [Number(quantity)]
                      );

                      tx.moveCall({
                        target: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::mint_with_coin`,
                        // target: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::mint`,
                        arguments: [
                          tx.object(utilsSui.PROGRAM.TREASURY_TICKET),
                          tx.object(
                            '0x7e1385925985b0efd22216997f7499771227b4406d45437be71d6d3b8aa8a690'
                          ),
                          // coin_ticket,
                          coin_sui,
                        ],
                      });

                      await utilsSui.signAndExecuteTransaction(tx);
                    }

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
