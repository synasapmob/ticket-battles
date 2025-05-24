import { Grid, GridProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'node_modules/@types/react';

interface ProfileNFTsGridProps extends PropsWithChildren {
  variant?: GridProps;
}

export default ({ children, variant }: ProfileNFTsGridProps) => {
  return (
    <Grid
      gridTemplateColumns={{
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
        xl: 'repeat(5, 1fr)',
      }}
      gap={4}
      {...variant}
    >
      {children}
    </Grid>
  );
};
