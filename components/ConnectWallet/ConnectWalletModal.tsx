import {
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useConnectWallet, useWallets } from '@mysten/dapp-kit';
import React from 'react';

import useToast from 'hook/useToast';
import SlushIcon from 'public/wallet/slush.svg';

interface ConnectWalletModalProps {
  onClose: () => void;
}

export default ({ onClose }: ConnectWalletModalProps) => {
  const get_wallets = useWallets();
  const connect_wallet = useConnectWallet();

  const toast = useToast();

  const ListWallet = [
    {
      key: 'Slush',
      icon: <Icon as={SlushIcon} width={6} height={6} />,
    },
  ];

  return (
    <Modal isOpen={true} onClose={onClose} variant="shadow">
      <ModalOverlay />

      <ModalContent padding={4}>
        <ModalHeader padding={0}>
          <Stack spacing={1}>
            <Center justifyContent="space-between">
              <Text color="white" fontWeight="bold">
                Connect your wallet
              </Text>

              <ModalCloseButton position="unset" />
            </Center>

            <Text color="shader.a.300" fontSize="xs">
              If you dont have a wallet, you can create one now.
            </Text>
          </Stack>
        </ModalHeader>

        <ModalBody padding={0} mt={4}>
          <Stack>
            {get_wallets?.length
              ? ListWallet.map(meta => {
                  return (
                    <Button
                      key={meta.key}
                      borderRadius="lg"
                      height="3.25rem"
                      color="shader.a.300"
                      justifyContent="flex-start"
                      transitionDuration="ultra-slow"
                      px={2}
                      iconSpacing={3.5}
                      loadingText={meta.key}
                      spinner={<Spinner width={6} height={6} />}
                      _hover={{
                        bg: 'shader.a.500',
                        color: 'white',
                      }}
                      leftIcon={meta.icon}
                      onClick={async () => {
                        try {
                          const required_features = get_wallets?.find(
                            wallet => wallet.name === meta.key
                          );

                          console.log('required_features', required_features);

                          if (!required_features) throw 'not found';

                          const standard_connect =
                            await connect_wallet.mutateAsync({
                              wallet: required_features,
                            });

                          console.log(
                            'connect_wallet.mutateAsync',
                            standard_connect
                          );
                        } catch (error) {
                          toast({
                            status: 'error',
                            description: JSON.stringify(error),
                          });
                        }
                      }}
                    >
                      {meta.key}
                    </Button>
                  );
                })
              : null}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
