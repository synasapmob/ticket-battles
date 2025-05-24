import { Flex, FlexProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface IdentifyLinearContainerProps extends PropsWithChildren {
  variant?: FlexProps;
}

export default ({ children, variant }: IdentifyLinearContainerProps) => {
  return (
    <Flex height="4.25rem" overflow="hidden" borderRadius="xl" {...variant}>
      {children}
    </Flex>
  );
};
