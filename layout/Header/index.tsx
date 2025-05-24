import { Box, Center, Container, HStack, theme } from '@chakra-ui/react';

import HeaderAccount from './HeaderAccount';
import HeaderBalance from './HeaderBalance';
import HeaderDrawer from './HeaderDrawer';
import HeaderNotification from './HeaderNotification';

import ConnectWalletWrapper from 'components/ConnectWallet/ConnectWalletWrapper';

export default () => {
  return (
    <Box
      as="header"
      position="sticky"
      zIndex="sticky"
      display="flex"
      py={3}
      bg="shader.a.800"
      top={0}
    >
      <Center
        as={Container}
        maxWidth={theme.breakpoints['2xl']}
        justifyContent="flex-end"
      >
        <ConnectWalletWrapper
          render={account => (
            <>
              <Box
                display={{
                  md: 'none',
                }}
              >
                <HeaderDrawer account={account} />
              </Box>

              <HStack
                display={{
                  base: 'none',
                  md: 'flex',
                }}
              >
                <HeaderNotification />

                <HeaderBalance />

                <HeaderAccount account={account} />
              </HStack>
            </>
          )}
        />
      </Center>
    </Box>
  );
};
