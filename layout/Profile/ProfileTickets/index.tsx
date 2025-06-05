import { Skeleton } from '@chakra-ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import ProfileNFTsGrid from '../ProfileNFTs/ProfileNFTsGrid';

import { ProfilePageProps } from 'app/profile/[address]/page';
import AvatarFallback from 'components/Avatar/AvatarFallback';
import ButtonTryAgain from 'components/Button/ButtonTryAgain';
import CardNFTLayout from 'components/Card/CardNFT/CardNFTLayout';
import TicketJPG from 'public/icon/ticket.jpg';
import utilsSui from 'utils/utils.sui';

export default ({ params }: ProfilePageProps) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['ticket_owner', params.address],
    queryFn: async () => {
      const { data } = await utilsSui.getSuiClient.getOwnedObjects({
        owner: params.address,
        filter: {
          StructType: `${utilsSui.PROGRAM.PACKAGE}::ticket::Ticket`,
        },
      });

      return data.map(meta => String(meta.data?.objectId));
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
              {data.map(meta => (
                <CardNFTLayout key={meta}>
                  <AvatarFallback src={TicketJPG.src} alt={TicketJPG.src} />
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
