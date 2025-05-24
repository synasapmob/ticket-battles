import { Center, CenterProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface IdentifyLinearBodyProps extends PropsWithChildren {
  linear: 'green' | 'red' | 'black';
  variant?: CenterProps;
}

export default ({ linear, children, variant }: IdentifyLinearBodyProps) => {
  return (
    <Center
      justifyContent="space-between"
      width="full"
      height="full"
      px={4}
      bg={(function () {
        if (linear === 'green') {
          return 'linear-gradient(90deg, rgba(137, 233, 97, 0.15) 0%, rgba(137, 233, 97, 0.015) 100%)';
        }

        if (linear === 'red') {
          return 'linear-gradient(90deg, rgba(233, 97, 97, 0.15) 0%, rgba(233, 97, 97, 0.015) 100%)';
        }

        if (linear === 'black') {
          return 'linear-gradient(90deg, #292B31 0%, rgba(32, 34, 39, 0.35) 100%)';
        }
      })()}
      {...variant}
    >
      {children}
    </Center>
  );
};
