import { AspectRatio, Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

import ProfileNFTsGrid from './ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTBottom from 'components/Card/CardNFT/CardNFTBottom';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import CardNFTName from 'components/Card/CardNFT/CardNFTName';
import CardNFTTokenID from 'components/Card/CardNFT/CardNFTTokenID';
import useOwnedObject from 'hook/useOwnedObject';
import { TypeOwnedObjectSuiParsedData } from 'types';
import { TypeNFTMetadata } from 'types/types.nft';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const ticketOwnedObject = useOwnedObject<
    TypeOwnedObjectSuiParsedData<TypeNFTMetadata>
  >({
    queryKey: `nft::NFT/${params.address}`,
    input: {
      owner: params.address,
      filter: {
        StructType: `${utilsSui.PROGRAM.PACKAGE_ID}::nft::NFT`,
      },
      options: {
        showContent: true,
      },
    },
  });

  return (
    <>
      {ticketOwnedObject.isLoading && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!ticketOwnedObject.isLoading && (
        <>
          {ticketOwnedObject.data?.length ? (
            <ProfileNFTsGrid>
              {ticketOwnedObject.data.map(meta => {
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
              isFetching={ticketOwnedObject.isFetching}
              refetch={ticketOwnedObject.refetch}
            />
          )}
        </>
      )}
    </>
  );
};
