import { Stack, StackProps } from '@chakra-ui/react';

import colors from 'theme/colors';
import { convertHex } from 'utils';

export default (props?: StackProps) => {
  return (
    <Stack
      padding={4}
      bg={convertHex(colors.shader.a[500], 0.65)}
      flex={1}
      {...props}
    />
  );
};
