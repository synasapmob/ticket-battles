import { ButtonProps, useDisclosure } from '@chakra-ui/react';

import ConnectWalletModal from './ConnectWalletModal';

import ConnectWallet from '.';

import {
  AccountContextProps,
  useAccountContext,
} from 'components/Context/ContextAccount';

interface ConnectWalletWrapperProps {
  // eslint-disable-next-line no-unused-vars
  render: (account: NonNullable<AccountContextProps['account']>) => JSX.Element;
  variant?: ButtonProps;
}

export default ({ render, variant }: ConnectWalletWrapperProps) => {
  const { account } = useAccountContext();

  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      {account ? (
        render(account)
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
