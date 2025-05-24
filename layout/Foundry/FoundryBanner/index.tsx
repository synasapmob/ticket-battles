import { Box, Image } from '@chakra-ui/react';

import Image2WEBP from 'public/image/image_2.webp';

export default () => {
  return (
    <Box
      flexBasis={{
        lg: '60%',
      }}
    >
      <Image
        src={Image2WEBP.src}
        alt="image-2"
        objectFit="cover"
        width="full"
        height={{
          base: 64,
          sm: 'md',
          lg: 'lg',
        }}
      />
    </Box>
  );
};
