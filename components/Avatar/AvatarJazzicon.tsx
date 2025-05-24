import { Box } from '@chakra-ui/react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

interface AvatarJazzicon {
  seed?: string;
}

export default ({ seed }: AvatarJazzicon) => {
  return (
    <Box
      as={Jazzicon}
      seed={seed?.length ? jsNumberForAddress(seed) : Math.random() * 100}
      width="100%"
      height="100%"
      paperStyles={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
