import { Center, Icon } from '@chakra-ui/react';

import Button3D from 'components/Button/Button3D';
import SwapFill from 'public/fill/swap.svg';

export default () => {
  return (
    <Center
      bg="black"
      position="absolute"
      inset="50% auto auto 50%"
      transform="translate(-50%, -50%)"
      borderRadius="full"
      width={16}
      height={16}
    >
      <Button3D
        shape="green"
        borderRadius="inherit"
        justifyContent="center"
        width={12}
        height={12}
      >
        <Icon as={SwapFill} width={6} height={6} color="white" />
      </Button3D>
    </Center>
  );
};
