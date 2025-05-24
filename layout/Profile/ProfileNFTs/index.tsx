import { AspectRatio, Box, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
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
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['profile', params.address],
    queryFn: async () => {
      const nfts = await utilsSui.getSuiClient.getOwnedObjects({
        owner: params.address,
        filter: {
          Package: utilsSui.PACKAGE_ID,
        },
        options: {
          showContent: true,
        },
      });

      const parse = nfts.data.map(meta => meta.data?.content) as unknown as {
        fields: TypeNFTMetadata;
      }[];

      return parse;
    },
  });

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
          {data?.length ? (
            <ProfileNFTsGrid>
              {data.map(meta => (
                <CardNFTLayout key={meta.fields.id.id}>
                  <Box position="relative">
                    <AspectRatio ratio={1 / 1} pointerEvents="none">
                      <AvatarFallback
                        src={meta.fields.url}
                        alt={meta.fields.name}
                      />
                    </AspectRatio>
                  </Box>

                  <CardNFTBottom>
                    <CardNFTTokenID tokenID={meta.fields.id.id} />

                    <CardNFTName name={meta.fields.name} />
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
