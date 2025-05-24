import { Text, TextProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface IdentifyLinearYieldProps extends PropsWithChildren {
  linear: 'green' | 'red' | 'shader' | 'white';
  variant?: TextProps;
}

export default ({ linear, children, variant }: IdentifyLinearYieldProps) => {
  return (
    <Text
      fontWeight={(function () {
        if (linear === 'green') {
          return 'medium';
        }

        if (linear === 'red') {
          return 'semibold';
        }

        if (linear === 'shader') {
          return 'semibold';
        }
      })()}
      color={(function () {
        if (linear === 'green') {
          return 'accents.green';
        }

        if (linear === 'red') {
          return 'accents.red';
        }

        if (linear === 'shader') {
          return 'shader.a.200';
        }

        if (linear === 'white') {
          return 'white';
        }
      })()}
      {...variant}
    >
      {children}
    </Text>
  );
};
