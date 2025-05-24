import { Box, HStack, Stack, Text } from '@chakra-ui/react';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarJazzicon from 'components/Avatar/AvatarJazzicon';
import ButtonCopy from 'components/Button/ButtonCopy';
import { shorten } from 'utils';

export default ({ params }: ProfilePageProps) => {
  return (
    <HStack>
      <Box width={10} height={10}>
        <AvatarJazzicon seed={params.address} />
      </Box>

      <Stack>
        <Text color="shader.a.100" fontWeight="medium">
          Unnamed
        </Text>

        <HStack color="shader.a.300">
          <Text>{shorten(params.address)}</Text>

          <ButtonCopy
            value={params.address}
            sx={{
              height: 'unset',
            }}
          />
        </HStack>
      </Stack>
    </HStack>
  );
};
