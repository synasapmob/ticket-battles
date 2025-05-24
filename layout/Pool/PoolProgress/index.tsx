import { AspectRatio, Center, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import PoolModal from '../PoolModal';

import LoadingGIF from 'public/loading/loading.gif';

interface PoolProgressProps {
  isJoin: boolean | undefined;
  isProgress: boolean | undefined;
  setIsProgress: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setJoin: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default ({
  isJoin,
  isProgress,
  setIsProgress,
  setJoin,
}: PoolProgressProps) => {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const subscribe: any = setInterval(() => {
      if (counter <= 1) {
        setIsProgress(true);

        return clearInterval(subscribe);
      }

      return setCounter(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(subscribe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

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
            {/* Looking for a battle... */}
            The battle will begin in a few seconds...
          </Text>
        </Center>
      )}

      {isProgress && (
        <PoolModal
          onClose={() => {
            setIsProgress(undefined);
            setJoin(undefined);
          }}
        />
      )}
    </>
  );
};
