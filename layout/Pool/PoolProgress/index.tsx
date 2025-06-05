import { AspectRatio, Center, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import PoolModal from '../PoolModal';

import LoadingGIF from 'public/loading/loading.gif';

interface PoolProgressProps {
  isJoined: boolean | undefined;
  isProgress: boolean | undefined;
  onSuccess: () => void;
}

export default ({ isJoined, isProgress, onSuccess }: PoolProgressProps) => {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (isProgress) {
      const subscribe = setInterval(() => {
        if (!counter) {
          return clearInterval(subscribe);
        }

        return setCounter(prev => prev - 1);
      }, 1000);

      return () => {
        clearInterval(subscribe);
      };
    }
  }, [counter, isProgress]);

  return (
    <>
      {isJoined && (
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
            {isProgress
              ? `The battle will begin in ${counter} seconds.`
              : 'Still waiting for 10 users to join.'}
          </Text>
        </Center>
      )}

      {!counter ? (
        <PoolModal
          onClose={() => {
            setCounter(5);
            onSuccess();
          }}
        />
      ) : null}
    </>
  );
};
