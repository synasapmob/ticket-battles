import { Box, BoxProps } from '@chakra-ui/react';

export default (props?: BoxProps) => {
  return (
    <Box
      position="absolute"
      width="full"
      height={56}
      pointerEvents="none"
      {...props}
    />
  );
};
