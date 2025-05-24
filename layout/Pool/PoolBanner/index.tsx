import { AspectRatio } from '@chakra-ui/layout';
import Image from 'next/image';

import Image3WEBP from 'public/image/image_3.webp';

export default () => {
  return (
    <AspectRatio
      width="full"
      height={{
        base: 64,
        md: 'lg',
      }}
    >
      <Image src={Image3WEBP} alt="battle-banner" />
    </AspectRatio>
  );
};
