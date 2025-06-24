'use client';

import { AspectRatio, Box, Container, Skeleton, theme } from '@chakra-ui/react';
import { bcs } from '@mysten/bcs';
import Image from 'next/image';
import React from 'react';

import AvatarFallback from 'components/Avatar/AvatarFallback';
import Back from 'components/Back';
import CardNFTBottom from 'components/Card/CardNFT/CardNFTBottom';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import CardNFTName from 'components/Card/CardNFT/CardNFTName';
import CardNFTRarity from 'components/Card/CardNFT/CardNFTRarity';
import CardNFTTokenID from 'components/Card/CardNFT/CardNFTTokenID';
import useDevInspect from 'hook/useDevInspect';
import useQueryEvent from 'hook/useQueryEvent';
import ProfileNFTsGrid from 'layout/Profile/ProfileNFTs/ProfileNFTsGrid';
import { TypeNFTMetadata } from 'types/types.nft';
import { convertHex } from 'utils';

export default () => {
  const getNFTsFromEvents = useQueryEvent<TypeNFTMetadata>({
    type: 'nft::NFTEvent',
  });

  const getDevInspectMaxToken = useDevInspect({
    type: 'shared::MAX_TOKEN',
  });

  const getMaxToken = getDevInspectMaxToken.data?.length
    ? /* 
        why +1 ?:
          token representation as index they count from 0 to N (index of arrays)
          if you map that'll missing 1st, so +1 necessary to render fully
      */
      Number(
        bcs
          .u64()
          .parse(
            bcs.byteVector().serialize(getDevInspectMaxToken.data[0][0]).parse()
          )
      ) + 1
    : 0;

  return (
    <Container
      maxWidth={theme.breakpoints.xl}
      display="flex"
      flexDirection="column"
      my={6}
      gap={6}
    >
      <Back />

      {getDevInspectMaxToken.isLoading && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!getDevInspectMaxToken.isLoading && (
        <>
          <ProfileNFTsGrid>
            {[...Array(getMaxToken)].map((_, index) => {
              const { name, tokenId } = (function () {
                const { name } = require(
                  `public/metadata/metadata/${index}.json`
                );

                // ['name', '#12']
                const separate = name.split(' ');

                return {
                  name: separate[0] as string,
                  tokenId: Number(
                    separate[separate.length - 1].replace('#', '')
                  ),
                };
              })();

              const isLocked = !getNFTsFromEvents.data?.some(
                meta => Number(meta?.tokenId) === tokenId
              );

              return (
                <CardNFTLayout key={tokenId}>
                  {isLocked && (
                    <Box
                      position="absolute"
                      inset={0}
                      zIndex="docked"
                      bg={convertHex('#000000', 0.45)}
                    />
                  )}

                  <Box position="relative">
                    {isLocked && (
                      <Box
                        zIndex="docked"
                        position="absolute"
                        inset="50% auto auto 50%"
                        transform="translate(-50%, -50%)"
                      >
                        <Image
                          src="icon/padlock.png"
                          alt="padlock"
                          width={48}
                          height={48}
                        />
                      </Box>
                    )}

                    <AspectRatio ratio={1 / 1}>
                      <AvatarFallback src={`/metadata/assets/${tokenId}.png`} />
                    </AspectRatio>
                  </Box>

                  <CardNFTBottom>
                    <CardNFTRarity tokenId={tokenId} />

                    <CardNFTTokenID tokenID={tokenId} />

                    <CardNFTName name={name} />
                  </CardNFTBottom>
                </CardNFTLayout>
              );
            })}
          </ProfileNFTsGrid>
        </>
      )}
    </Container>
  );
};
