import { AspectRatio, Center, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import PoolModal from '../PoolModal';

import LoadingGIF from 'public/loading/loading.gif';

interface PoolProgressProps {
  isJoin: boolean | undefined;
  isProgress: string | undefined;
  setIsProgress: Dispatch<SetStateAction<string | undefined>>;
}

export default ({ isJoin, isProgress, setIsProgress }: PoolProgressProps) => {
  return (
    <>
      {isJoin && (
        <Center
          position="absolute"
          bg="linear-gradient(180deg, rgba(14, 15, 19, 0) 0%, #0E0F13 100%)"
          flexDirection="column"
          gap={2}
          inset={0}
        >
          <AspectRatio width="9.375rem" height="9.375rem" blendMode="lighten">
            <Image src={LoadingGIF.src} alt={LoadingGIF.src} fill />
          </AspectRatio>

          <Text color="white" fontWeight="semibold" fontSize="2xl">
            The battle will begin in a few seconds...
          </Text>
        </Center>
      )}

      {isProgress?.length && (
        <PoolModal
          onClose={() => {
            setIsProgress(undefined);
          }}
        />
      )}
    </>
  );
};
