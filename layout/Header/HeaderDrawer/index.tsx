import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react';

import HeaderBalance from '../HeaderBalance';
import HeaderListOption from '../HeaderList/HeaderListOption';

import { AccountContextProps } from 'components/Context/ContextAccount';
import MenuLineIcon from 'public/line/menu.svg';
import { shorten } from 'utils';

interface HeaderDrawerProps {
  account: NonNullable<AccountContextProps['account']>;
}

export default ({ account }: HeaderDrawerProps) => {
  return (
    <Popover placement="bottom-end">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              aria-label="menu"
              borderRadius="lg"
              bg="a.700"
              width={8}
              height={8}
              icon={<Icon as={MenuLineIcon} width={5} height={5} />}
            />
          </PopoverTrigger>

          <PopoverContent
            padding={3}
            bg="shader.a.900"
            borderRadius="xl"
            border="0.0625rem solid"
            borderColor="shader.a.500"
          >
            <Stack>
              <Button variant="primary">{shorten(account)}</Button>

              <HeaderBalance />

              <HeaderListOption account={account} onClose={onClose} />
            </Stack>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
