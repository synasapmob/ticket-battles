import { Box, Image } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

import ChakraBox from 'components/ChakraBox';
import Image1WEBP from 'public/image/image_1.webp';
import Image2WEBP from 'public/image/image_2.webp';
import Image3WEBP from 'public/image/image_3.webp';
import Image4WEBP from 'public/image/image_4.webp';

interface HomeArticleBannerProps {
  hover: number | undefined;
}

export default ({ hover }: HomeArticleBannerProps) => {
  const ListImage = [Image2WEBP, Image3WEBP, Image4WEBP];

  return (
    <Box
      flexBasis={{
        lg: '60%',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <ChakraBox
          key={hover}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: 'linear',
          }}
        >
          <Image
            src={
              typeof hover === 'number' ? ListImage[hover].src : Image1WEBP.src
            }
            objectFit="cover"
            alt="image"
            width="full"
            height={{
              base: 64,
              sm: 80,
              lg: '37.5rem',
            }}
          />
        </ChakraBox>
      </AnimatePresence>
    </Box>
  );
};
