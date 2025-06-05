import { AspectRatio, Box, Skeleton } from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';

import ProfileNFTsGrid from './ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTBottom from 'components/Card/CardNFT/CardNFTBottom';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import CardNFTName from 'components/Card/CardNFT/CardNFTName';
import CardNFTTokenID from 'components/Card/CardNFT/CardNFTTokenID';
import { TypeNFTMetadata } from 'types/types.nft';
import { getNFTsByIPFS } from 'utils';
import utilsConstants from 'utils/utils.constants';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
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

  const getNFTsFromObject = useQuery({
    queryKey: ['nft_owner', params.address],
    queryFn: async () => {
      const { data } = await utilsSui.getSuiClient.getOwnedObjects({
        owner: params.address,
        filter: {
          StructType: `${utilsSui.PROGRAM.PACKAGE}::nft::NFT`,
        },
        options: {
          showContent: true,
        },
      });

      return data.map(meta => {
        if (meta.data?.content?.dataType === 'moveObject') {
          return meta.data.content.fields;
        }
      }) as TypeNFTMetadata[];
    },
  });

  return (
    <>
      {(getNFTsFromObject.isLoading || getNFTsFromIPFS.isLoading) && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!(getNFTsFromObject.isLoading || getNFTsFromIPFS.isLoading) && (
        <>
          {getNFTsFromObject.data?.length ? (
            <ProfileNFTsGrid>
              {getNFTsFromObject.data.map(meta => {
                const getMetadata = getNFTsFromIPFS.data?.pages.find(ipfs => {
                  const [, tokenId] = ipfs.name.split('#');

                  return Number(meta.tokenId) === Number(tokenId);
                });

                return (
                  <CardNFTLayout key={meta.tokenId}>
                    <Box position="relative">
                      <AspectRatio ratio={1 / 1} pointerEvents="none">
                        <AvatarFallback
                          src={getMetadata?.image?.replace(
                            utilsConstants.IPFS_PREFIX,
                            utilsConstants.IPFS_GATEWAY
                          )}
                        />
                      </AspectRatio>
                    </Box>

                    <CardNFTBottom>
                      <CardNFTTokenID tokenID={meta.tokenId} />

                      <CardNFTName name={getMetadata?.name || '-'} />
                    </CardNFTBottom>
                  </CardNFTLayout>
                );
              })}
            </ProfileNFTsGrid>
          ) : (
            <ButtonTryAgain
              isFetching={getNFTsFromObject.isFetching}
              refetch={getNFTsFromObject.refetch}
            />
          )}
        </>
      )}
    </>
  );
};
