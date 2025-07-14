import { Box, Center, Container, HStack, theme } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

import HeaderAccount from './HeaderAccount';
import HeaderBalance from './HeaderBalance';
import HeaderDrawer from './HeaderDrawer';
import HeaderExtension from './HeaderExtension';
import HeaderNotification from './HeaderNotification';

import ConnectWalletWrapper from 'components/ConnectWallet/ConnectWalletWrapper';
import LogoPNG from 'public/icon/logo.png';

export default () => {
  return (
    <Box
      as="header"
      position="sticky"
      zIndex="sticky"
      display="flex"
      py={2}
      bg="shader.a.800"
      top={0}
    >
      <Center
        as={Container}
        maxWidth={theme.breakpoints.xl}
        justifyContent="space-between"
      >
        <Link href="/">
          <Image src={LogoPNG.src} alt={LogoPNG.src} width={200} height={68} />
        </Link>

        <HStack>
          <HeaderExtension />

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
        </HStack>
      </Center>
    </Box>
  );
};
