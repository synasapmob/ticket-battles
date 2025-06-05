import { ButtonProps, Skeleton, SkeletonProps } from '@chakra-ui/react';
import { useCurrentAccount } from '@mysten/dapp-kit';

import Button3D from 'components/Button/Button3D';
import useBalance from 'hook/useBalance';
import { formatNumberDecimal } from 'utils';

interface HeaderBalanceProps {
  variant?: ButtonProps;
}

export default ({ variant }: HeaderBalanceProps) => {
  const current_account = useCurrentAccount();

  const { data, isLoading } = useBalance(current_account?.address);

  return (
    <>
      {isLoading && (
        <Skeleton width={20} height={10} {...(variant as SkeletonProps)} />
      )}

      {!isLoading && (
        <>
          {typeof data === 'number' && (
            <Button3D shape="black" {...variant}>
              {formatNumberDecimal(data).toFixed(4)} SUI
            </Button3D>
          )}
        </>
      )}
    </>
  );
};
