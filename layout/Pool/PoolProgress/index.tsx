import { AspectRatio, Center, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import PoolModal from '../PoolModal';

import LoadingGIF from 'public/loading/loading.gif';
import { TypePoolEventPool } from 'types/types.pool';
import getQueryClient from 'utils/utils.queryClient';

interface PoolProgressProps {
  getEnoughParticipants: number;
  winner: TypePoolEventPool['winner'];
  isJoined: boolean | undefined;
  onSuccess: () => void;
}

export default ({
  getEnoughParticipants,
  winner,
  isJoined,
  onSuccess,
}: PoolProgressProps) => {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (winner?.length) {
      const subscribe: NodeJS.Timeout = setInterval(() => {
        if (!counter) {
          // reset cache
          fetch('/api/pool', {
            method: 'DELETE',
          });

          // refetch for winner
          getQueryClient.refetchQueries({
            queryKey: ['useOwnedObject', `nft::NFT/${winner}`],
          });

          return clearInterval(subscribe);
        }

        return setCounter(prev => prev - 1);
      }, 1000);

      return () => {
        clearInterval(subscribe);
      };
    }
  }, [counter, winner]);

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
            {winner?.length
              ? `The battle will begin in ${counter} seconds.`
              : `Still waiting for ${getEnoughParticipants} users to join.`}
          </Text>
        </Center>
      )}

      {!counter && winner?.length ? (
        <PoolModal
          winner={winner}
          onClose={() => {
            setCounter(5);
            onSuccess();
          }}
        />
      ) : null}
    </>
  );
};
