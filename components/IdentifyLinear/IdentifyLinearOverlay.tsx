import { Box, BoxProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface IdentifyLinearOverlayProps extends PropsWithChildren {
  linear: 'green' | 'red' | 'black';
  variant?: BoxProps;
}

export default ({ linear, children, variant }: IdentifyLinearOverlayProps) => {
  return (
    <Box
      position="absolute"
      inset="0 0 0 auto"
      width="50%"
      bg={(function () {
        if (linear === 'green') {
          return 'linear-gradient(270deg, #283726 0%, rgba(40, 55, 38, 0) 100%)';
        }

        if (linear === 'red') {
          return 'linear-gradient(270deg, #362226 0%, rgba(54, 34, 38, 0) 100%)';
        }

        if (linear === 'black') {
          return 'linear-gradient(270deg, #292B31 0%, rgba(41, 43, 49, 0) 100%)';
        }
      })()}
      {...variant}
    >
      {children}
    </Box>
  );
};
