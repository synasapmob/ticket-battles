import { Button, Icon, useClipboard } from '@chakra-ui/react';
import { useDisconnectWallet } from '@mysten/dapp-kit';
import Link from 'node_modules/next/link';
import { useState } from 'react';
import { type WalletAccount } from 'wallet-standard';

import CheckIcon from 'public/line/check.svg';
import CopyIcon from 'public/line/copy.svg';
import LogoutIcon from 'public/line/logout.svg';
import UserIcon from 'public/line/user.svg';

interface HeaderListOptionProps {
  account: WalletAccount;
  onClose: () => void;
}

export default ({ account, onClose }: HeaderListOptionProps) => {
  const disconnect_wallet = useDisconnectWallet();

  const { hasCopied, onCopy } = useClipboard(account.address);

  const [loading, setLoading] = useState<string>();

  return (
    <>
      <Button
        variant="dark"
        onClick={onCopy}
        leftIcon={
          <Icon as={hasCopied ? CheckIcon : CopyIcon} width={4} height={4} />
        }
      >
        Copy Address
      </Button>

      <Link href={`/profile/${account.address}`} onClick={onClose}>
        <Button
          variant="dark"
          leftIcon={<Icon as={UserIcon} width={4} height={4} />}
        >
          My Profile
        </Button>
      </Link>

      <Button
        variant="dark"
        leftIcon={
          <Icon as={LogoutIcon} width={5} height={5} color="accents.red" />
        }
        loadingText="Disconnected"
        isLoading={loading === 'disconnected'}
        onClick={async () => {
          try {
            setLoading('disconnected');

            await disconnect_wallet.mutateAsync();

            onClose();
          } finally {
            setLoading(undefined);
          }
        }}
      >
        Disconnected
      </Button>
    </>
  );
};
