import { Skeleton } from '@chakra-ui/skeleton';
import React from 'react';

import ProfileNFTsGrid from '../ProfileNFTs/ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import useOwnedObject from 'hook/useOwnedObject';
import TicketJPG from 'public/icon/ticket.jpg';
import { TypeOwnedObjectSuiParsedData } from 'types';
import { TypeTicketContentField } from 'types/types.ticket';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const ticketOwnedObject = useOwnedObject<
    TypeOwnedObjectSuiParsedData<TypeTicketContentField>
  >({
    queryKey: `ticket::Ticket/${params.address}`,
    input: {
      owner: params.address,
      filter: {
        StructType: `${utilsSui.PROGRAM.PACKAGE_ID}::ticket::Ticket`,
      },
      options: {
        showContent: true,
      },
    },
  });

  const ticketTotalAmount = Number(
    ticketOwnedObject.data?.[0]?.content?.fields?.amount || 0
  );

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
          {ticketTotalAmount ? (
            <ProfileNFTsGrid>
              {React.Children.toArray(
                [...Array(ticketTotalAmount)].map(() => (
                  <CardNFTLayout>
                    <AvatarFallback src={TicketJPG.src} alt={TicketJPG.src} />
                  </CardNFTLayout>
                ))
              )}
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
