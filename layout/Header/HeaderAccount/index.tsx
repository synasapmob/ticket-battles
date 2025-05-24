import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  theme,
} from '@chakra-ui/react';
import { type WalletAccount } from 'wallet-standard';

import HeaderListOption from '../HeaderList/HeaderListOption';

import Button3D from 'components/Button/Button3D';
import { shorten } from 'utils';

interface HeaderListProps {
  account: WalletAccount;
}

export default ({ account }: HeaderListProps) => {
  return (
    <>
      <Popover placement="bottom-end">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button3D shape="green">{shorten(account.address)}</Button3D>
            </PopoverTrigger>

            <PopoverContent
              padding={3}
              bg="shader.a.800"
              borderRadius={theme.space['2.5']}
              border="0.0625rem solid"
              borderColor="shader.a.500"
            >
              <Stack>
                <HeaderListOption account={account} onClose={onClose} />
              </Stack>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
};
