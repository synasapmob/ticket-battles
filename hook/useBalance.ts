import { GetBalanceParams } from '@mysten/sui/client';
import { useQuery } from '@tanstack/react-query';

import { useProvidersContext } from 'components/Context/ContextProviders';
import { TypeWalletEnum } from 'types';
import utilsConstants from 'utils/utils.constants';
import { getCookie } from 'utils/utils.cookie';
import utilsSui from 'utils/utils.sui';

interface useBalanceProps {
  address: string | undefined;
  options?: Partial<GetBalanceParams>;
}

export default (params: useBalanceProps) => {
  const { providers } = useProvidersContext();

  const query = useQuery<number | undefined>({
    queryKey: ['balance', params.address, params?.options],
    queryFn: async () => {
      if (params.address?.length) {
        const getExtension = getCookie(utilsConstants.WALLET_EXTENSION);

        if (getExtension === TypeWalletEnum.Slush) {
          const getBalance = await utilsSui.getSuiClient.getBalance({
            owner: params.address,
            ...params.options,
          });

          return Number(getBalance.totalBalance);
        }

        if (getExtension === TypeWalletEnum.MetaMask) {
          const JsonRPC = utilsConstants.JsonRPC({
            name: TypeWalletEnum.MetaMask,
            chainId: await providers?.MetaMask?.request({
              method: 'eth_chainId',
            }),
          });

          const getBalance = await JsonRPC.getBalance(params.address);

          return Number(getBalance);
        }
      }
    },
  });

  return query;
};
