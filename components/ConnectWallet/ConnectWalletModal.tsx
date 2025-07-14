import {
  Button,
  ButtonProps,
  Center,
  Icon,
  Image,
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
import {
  StandardConnect,
  StandardConnectFeature,
} from '@mysten/wallet-standard';
import React from 'react';

import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import { useProvidersContext } from 'components/Context/ContextProviders';
import useToast from 'hook/useToast';
import MetaMaskPNG from 'public/wallet/metamask.png';
import SlushIcon from 'public/wallet/slush.svg';
import SubWalletPNG from 'public/wallet/subwallet.png';
import { TypeWalletEnum } from 'types';

interface ListWalletProps {
  key: TypeWalletEnum;
  isNotInstalled: boolean;
  variant?: ButtonProps;
}

interface ConnectWalletModalProps {
  onClose: () => void;
}

export default ({ onClose }: ConnectWalletModalProps) => {
  const { providers } = useProvidersContext();
  const { updateExtension } = useExtensionContext();
  const { connectAccount } = useAccountContext();

  const toast = useToast();

  const ListWallet: ListWalletProps[] = [
    {
      key: TypeWalletEnum.Slush,
      isNotInstalled: !providers?.Slush,
      variant: {
        leftIcon: <Icon as={SlushIcon} width={6} height={6} />,
        onClick: async () => {
          try {
            const wallet = providers?.Slush;

            if (!wallet) {
              return window.open('https://slush.app/download', '_blank');
            }

            const { accounts } = await (
              wallet.features as StandardConnectFeature
            )[StandardConnect].connect();

            updateExtension(TypeWalletEnum.Slush);

            connectAccount({
              wallet: TypeWalletEnum.Slush,
              address: accounts[0].address,
            });
          } catch (error) {
            toast({
              status: 'error',
              description: JSON.stringify(error),
            });
          }
        },
      },
    },
    {
      key: TypeWalletEnum.MetaMask,
      isNotInstalled: !providers?.MetaMask,
      variant: {
        leftIcon: (
          <Image
            src={MetaMaskPNG.src}
            alt={MetaMaskPNG.src}
            width={6}
            height={6}
          />
        ),
        onClick: async () => {
          try {
            const wallet = providers?.MetaMask;

            if (!wallet) {
              return window.open('https://metamask.io/download', '_blank');
            }

            const accounts: string[] = await wallet.request({
              method: 'eth_requestAccounts',
            });

            updateExtension(TypeWalletEnum.MetaMask);

            connectAccount({
              wallet: TypeWalletEnum.MetaMask,
              address: accounts[0],
            });
          } catch (error) {
            toast({
              status: 'error',
              description: JSON.stringify(error),
            });
          }
        },
      },
    },
    {
      key: TypeWalletEnum.SubWallet,
      isNotInstalled: !providers?.SubWallet,
      variant: {
        leftIcon: (
          <Image
            src={SubWalletPNG.src}
            alt={SubWalletPNG.src}
            width={6}
            height={6}
          />
        ),
        onClick: async () => {
          try {
            const wallet = providers?.SubWallet;

            if (!wallet) {
              return window.open('https://metamask.io/download', '_blank');
            }

            const accounts: string[] = await wallet.request({
              method: 'eth_requestAccounts',
            });

            updateExtension(TypeWalletEnum.MetaMask);

            connectAccount({
              wallet: TypeWalletEnum.SubWallet,
              address: accounts[0],
            });
          } catch (error) {
            toast({
              status: 'error',
              description: JSON.stringify(error),
            });
          }
        },
      },
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
            {ListWallet.map(meta => {
              return (
                <Button
                  key={meta.key}
                  borderRadius="lg"
                  height="3.25rem"
                  justifyContent="flex-start"
                  transitionDuration="ultra-slow"
                  px={2}
                  iconSpacing={3.5}
                  spinner={<Spinner width={6} height={6} />}
                  loadingText={meta.key}
                  color={meta.isNotInstalled ? 'accents.green' : 'shader.a.300'}
                  _hover={{
                    bg: 'shader.a.500',
                    color: 'white',
                  }}
                  {...meta.variant}
                >
                  {(function () {
                    if (meta.isNotInstalled) return `Install ${meta.key}`;

                    return meta.key;
                  })()}
                </Button>
              );
            })}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
