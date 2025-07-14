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
import { useExtensionContext } from 'components/Context/ContextExtension';
import { TypeOwnedObjectSuiParsedData, TypeWalletEnum } from 'types';
import { TypeNFTMetadata } from 'types/types.nft';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const { extension } = useExtensionContext();

  const getMyNFTs = useQuery({
    queryKey: ['my_nfts', extension, params.address],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        return await utilsSui.getOwnedObject<
          TypeOwnedObjectSuiParsedData<TypeNFTMetadata>
        >({
          type: 'nft::NFT',
          options: {
            owner: params.address,
          },
        });
      }
    },
  });

  return (
    <>
      {getMyNFTs.isLoading && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!getMyNFTs.isLoading && (
        <>
          {getMyNFTs.data?.length ? (
            <ProfileNFTsGrid>
              {getMyNFTs.data.map(meta => {
                const name = (function () {
                  const { name } = require(
                    `public/metadata/metadata/${meta.content.fields.tokenId}.json`
                  );

                  // ['name', '#12']
                  const separate = name.split(' ');

                  return separate[0];
                })();

                return (
                  <CardNFTLayout key={meta.content.fields.tokenId}>
                    <Box position="relative">
                      <AspectRatio ratio={1 / 1} pointerEvents="none">
                        <AvatarFallback
                          src={`/metadata/assets/${meta.content.fields.tokenId}.png`}
                        />
                      </AspectRatio>
                    </Box>

                    <CardNFTBottom>
                      <CardNFTTokenID tokenID={meta.content.fields.tokenId} />

                      <CardNFTName name={name} />
                    </CardNFTBottom>
                  </CardNFTLayout>
                );
              })}
            </ProfileNFTsGrid>
          ) : (
            <ButtonTryAgain
              isFetching={getMyNFTs.isFetching}
              refetch={getMyNFTs.refetch}
            />
          )}
        </>
      )}
    </>
  );
};
