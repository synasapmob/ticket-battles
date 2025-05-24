import { ButtonProps, useDisclosure } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { type WalletAccount } from 'wallet-standard';

import ConnectWalletModal from './ConnectWalletModal';

import ConnectWallet from '.';

interface ConnectWalletWrapperProps {
  // eslint-disable-next-line no-unused-vars
  render: (account: WalletAccount) => JSX.Element;
  variant?: ButtonProps;
}

export default ({ render, variant }: ConnectWalletWrapperProps) => {
  const current_account = useCurrentAccount();

  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      {current_account?.address ? (
        render(current_account)
      ) : (
        <>
          <ConnectWallet
            variant={{
              onClick: onToggle,
              ...variant,
            }}
          />

          {isOpen && <ConnectWalletModal onClose={onClose} />}
        </>
      )}
    </>
  );
};
