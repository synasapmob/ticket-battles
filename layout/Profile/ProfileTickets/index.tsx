import { Skeleton } from '@chakra-ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import ProfileNFTsGrid from '../ProfileNFTs/ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import { useExtensionContext } from 'components/Context/ContextExtension';
import TicketJPG from 'public/icon/ticket.jpg';
import { TypeOwnedObjectSuiParsedData, TypeWalletEnum } from 'types';
import { TypeTicketContentField } from 'types/types.ticket';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const { extension } = useExtensionContext();

  const getMyTickets = useQuery({
    queryKey: ['my_tickets', extension, params.address],
    queryFn: async () => {
      if (extension === TypeWalletEnum.Slush) {
        return await utilsSui.getOwnedObject<
          TypeOwnedObjectSuiParsedData<TypeTicketContentField>
        >({
          type: 'ticket::Ticket',
          options: {
            owner: params.address,
          },
        });
      }
    },
  });

  const ticketTotalAmount = Number(
    getMyTickets.data?.[0]?.content?.fields?.amount || 0
  );

  return (
    <>
      {getMyTickets.isLoading && (
        <ProfileNFTsGrid>
          {React.Children.toArray(
            [...Array(10)].map(() => <Skeleton width="full" height={60} />)
          )}
        </ProfileNFTsGrid>
      )}

      {!getMyTickets.isLoading && (
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
              isFetching={getMyTickets.isFetching}
              refetch={getMyTickets.refetch}
            />
          )}
        </>
      )}
    </>
  );
};
