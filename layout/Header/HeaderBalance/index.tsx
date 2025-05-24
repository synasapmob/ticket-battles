import { ButtonProps, Skeleton, SkeletonProps } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

import Button3D from 'components/Button/Button3D';
import { formatNumberDecimal } from 'utils';
import utilsSui from 'utils/utils.sui';

interface HeaderBalanceProps {
  variant?: ButtonProps;
}

export default ({ variant }: HeaderBalanceProps) => {
  const current_account = useCurrentAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['balance', current_account?.address],
    queryFn: async () => {
      if (current_account?.address) {
        const getBalance = await utilsSui.getSuiClient.getBalance({
          owner: current_account.address,
        });

        return formatNumberDecimal(getBalance.totalBalance);
      }
    },
  });

  return (
    <>
      {isLoading && (
        <Skeleton width={20} height={10} {...(variant as SkeletonProps)} />
      )}

      {!isLoading && (
        <>
          {typeof data === 'number' && (
            <Button3D shape="black" {...variant}>
              {data.toFixed(4)} SUI
            </Button3D>
          )}
        </>
      )}
    </>
  );
};
