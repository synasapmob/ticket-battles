'use client';

import { AspectRatio, Box, Container, Skeleton, theme } from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';

import AvatarFallback from 'components/Avatar/AvatarFallback';
import Back from 'components/Back';
import CardNFTBottom from 'components/Card/CardNFT/CardNFTBottom';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import CardNFTName from 'components/Card/CardNFT/CardNFTName';
import CardNFTRarity from 'components/Card/CardNFT/CardNFTRarity';
import CardNFTTokenID from 'components/Card/CardNFT/CardNFTTokenID';
import useObjserver from 'hook/useObjserver';
import ProfileNFTsGrid from 'layout/Profile/ProfileNFTs/ProfileNFTsGrid';
import { TypeNFTMetadata } from 'types/types.nft';
import { convertHex, getNFTsByIPFS } from 'utils';
import utilsConstants from 'utils/utils.constants';

export default () => {
  const getNFTsFromIPFS = useInfiniteQuery({
    queryKey: [`create_nft_base`],
    queryFn: async () => {
      return await getNFTsByIPFS();
    },
    getNextPageParam: lastPage => {
      if (!lastPage?.length) return;

      return lastPage.length;
    },
    select(data) {
      return {
        pageParams: [],
        pages: data.pages.flatMap(page => page),
      };
    },
    initialPageParam: 1,
  });

  const getNFTs = useQuery({
    queryKey: ['nft_get'],
    queryFn: async () => {
      const { data } = await axios.get<TypeNFTMetadata[]>('/api/nft');

      return data;
    },
  });

  const { objserverStart } = useObjserver({
    fetchNextPage: getNFTsFromIPFS.fetchNextPage,
    hasNextPage:
      getNFTsFromIPFS.hasNextPage && !getNFTsFromIPFS.isFetchingNextPage,
  });

  return (
    <Container
      maxWidth={theme.breakpoints.xl}
      display="flex"
      flexDirection="column"
      my={6}
      gap={6}
    >
      <Back />

      {(getNFTsFromIPFS.isLoading || getNFTs.isLoading) && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!(getNFTsFromIPFS.isLoading || getNFTs.isLoading) && (
        <>
          {getNFTsFromIPFS.data?.pages.length ? (
            <ProfileNFTsGrid>
              {getNFTsFromIPFS.data.pages.map((meta, index, array) => {
                const [name, tokenId] = meta.name.split('#');

                const isLocked = getNFTs?.data?.some(
                  meta => meta?.tokenId === Number(tokenId)
                );

                return (
                  <CardNFTLayout
                    key={meta.name}
                    ref={
                      index === array.length - 1 ? objserverStart : undefined
                    }
                  >
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
                        <AvatarFallback
                          alt={meta.image}
                          src={meta.image.replace(
                            utilsConstants.IPFS_PREFIX,
                            utilsConstants.IPFS_GATEWAY
                          )}
                        />
                      </AspectRatio>
                    </Box>

                    <CardNFTBottom>
                      <CardNFTRarity tokenId={Number(tokenId)} />

                      <CardNFTTokenID tokenID={tokenId} />

                      <CardNFTName name={name} />
                    </CardNFTBottom>
                  </CardNFTLayout>
                );
              })}
            </ProfileNFTsGrid>
          ) : null}
        </>
      )}
    </Container>
  );
};
