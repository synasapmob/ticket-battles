import { ButtonProps, Skeleton, SkeletonProps } from '@chakra-ui/react';

import Button3D from 'components/Button/Button3D';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import useBalance from 'hook/useBalance';
import { formatNumberDecimal } from 'utils';
import utilsConstants from 'utils/utils.constants';

interface HeaderBalanceProps {
  variant?: ButtonProps;
}

export default ({ variant }: HeaderBalanceProps) => {
  const { extension } = useExtensionContext();
  const { account } = useAccountContext();

  const { data, isLoading } = useBalance({
    address: account,
  });

  const config = utilsConstants.WALLET_CONFIG.find(
    meta => meta.extension === extension
  );

  return (
    <>
      {isLoading && (
        <Skeleton width={20} height={10} {...(variant as SkeletonProps)} />
      )}

      {!isLoading && (
        <>
          {typeof data === 'number' && (
            <Button3D shape="black" {...variant}>
              {(function () {
                let price = formatNumberDecimal(data, config?.decimal);

                if (price >= 0.1) {
                  price = Number(price.toFixed(4));
                }

                return `${price} ${config?.symbol}`;
              })()}
            </Button3D>
          )}
        </>
      )}
    </>
  );
};
