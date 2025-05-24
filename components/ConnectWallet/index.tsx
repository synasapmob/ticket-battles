import { ButtonProps } from '@chakra-ui/react';

import Button3D from 'components/Button/Button3D';

interface ConnectWalletProps {
  variant?: Partial<ButtonProps>;
}

export default ({ variant }: ConnectWalletProps) => {
  return (
    <Button3D shape="green" {...variant}>
      Connect Wallet
    </Button3D>
  );
};
