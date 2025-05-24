import { Flex, FlexProps, forwardRef } from '@chakra-ui/react';
import { ForwardedRef } from 'react';

export default forwardRef(
  (props: FlexProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Flex
      flexDirection="column"
      position="relative"
      borderRadius="xl"
      border="0.0625rem solid"
      borderColor="shader.a.600"
      overflow="hidden"
      ref={ref}
      {...props}
    />
  )
);
