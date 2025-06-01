import { AspectRatio, Box, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
import { TypeTicketMetadata } from 'types/types.ticket';

export default ({ params }: ProfilePageProps) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['nft_get', params.address],
    queryFn: async () => {
      const { data } = await axios.get<TypeNFTMetadata[]>('/api/nft');

      return data;
    },
  });

  const myOwn = data?.filter(meta => meta?.owner === params.address);

  return (
    <>
      {isLoading && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!isLoading && (
        <>
          {myOwn?.length ? (
            <ProfileNFTsGrid>
              {myOwn.map(meta => (
                <CardNFTLayout key={meta.createdAt}>
                  <Box position="relative">
                    {/* <AspectRatio ratio={1 / 1} pointerEvents="none">
                      <AvatarFallback
                        src={meta.fields.url}
                        alt={meta.fields.name}
                      />
                    </AspectRatio> */}
                  </Box>

                  <CardNFTBottom>
                    <CardNFTTokenID tokenID={meta.tokenId} />

                    {/* <CardNFTName name={meta.} /> */}
                  </CardNFTBottom>
                </CardNFTLayout>
              ))}
            </ProfileNFTsGrid>
          ) : (
            <ButtonTryAgain isFetching={isFetching} refetch={refetch} />
          )}
        </>
      )}
    </>
  );
};
