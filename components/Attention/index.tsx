import { Text, TextProps } from '@chakra-ui/react';

import colors from 'theme/colors';
import { convertHex } from 'utils';

export default (props?: TextProps) => {
  return (
    <Text
      bg={convertHex(colors.accents.yellow, 0.1)}
      borderRadius="xl"
      color="accents.yellow"
      fontSize="sm"
      px={4}
      py={3}
      {...props}
    />
  );
};
