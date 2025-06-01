import { Skeleton } from '@chakra-ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

import ProfileNFTsGrid from '../ProfileNFTs/ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import TicketJPG from 'public/icon/ticket.jpg';
import { TypeTicketMetadata } from 'types/types.ticket';

export default ({ params }: ProfilePageProps) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['ticket_put', params.address],
    queryFn: async () => {
      const { data } = await axios.put<TypeTicketMetadata>('/api/ticket', {
        owner: params.address,
      });

      return data;
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
          {data ? (
            <ProfileNFTsGrid>
              {React.Children.toArray(
                [...Array(data.quantity)].map(() => (
                  <CardNFTLayout>
                    <AvatarFallback src={TicketJPG.src} alt={TicketJPG.src} />
                  </CardNFTLayout>
                ))
              )}
            </ProfileNFTsGrid>
          ) : (
            <ButtonTryAgain isFetching={isFetching} refetch={refetch} />
          )}
        </>
      )}
    </>
  );
};
