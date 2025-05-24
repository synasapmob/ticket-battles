'use client';

import {
  ChakraProvider,
  extendBaseTheme,
  theme as themeChakra,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import theme from 'theme/index';

export default ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider
      theme={extendBaseTheme(
        {
          components: {
            Container: themeChakra.components.Container,
            Modal: themeChakra.components.Modal,
            Alert: themeChakra.components.Alert,
            CloseButton: themeChakra.components.CloseButton,
            NumberInput: themeChakra.components.NumberInput,
          },
        },

        // extends theme root
        theme
      )}
    >
      {children}
    </ChakraProvider>
  );
};
