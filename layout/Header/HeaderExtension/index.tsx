import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from '@chakra-ui/react';

import Button3D from 'components/Button/Button3D';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import { TypeWalletEnum } from 'types';

export default () => {
  const { account } = useAccountContext();
  const { extension, updateExtension } = useExtensionContext();

  const ListVersion = [
    {
      key: TypeWalletEnum.Slush,
      fieldName: 'SUI',
    },
    {
      key: TypeWalletEnum.MetaMask,
      fieldName: 'EVM',
    },
  ];

  const CurrentVersion = ListVersion.find(meta => meta.key === extension);

  return (
    <Popover placement="bottom-end">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button3D isDisabled={!!account?.length} shape="sky">
              {CurrentVersion?.fieldName}
            </Button3D>
          </PopoverTrigger>

          <Portal>
            <PopoverContent>
              <PopoverBody
                padding={2}
                overflow="hidden"
                borderRadius="base"
                border="0.0625rem solid"
                borderColor="shader.a.500"
                bg="shader.a.700"
              >
                <Stack>
                  {ListVersion.map(meta => (
                    <Button
                      key={meta.key}
                      textTransform="capitalize"
                      variant="dark"
                      onClick={() => {
                        onClose();
                        updateExtension(meta.key);
                      }}
                    >
                      {meta.fieldName}
                    </Button>
                  ))}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};
