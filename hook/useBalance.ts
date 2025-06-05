import { useQuery } from '@tanstack/react-query';

import utilsSui from 'utils/utils.sui';

export default (address: string | undefined) => {
  const query = useQuery<number | undefined>({
    queryKey: ['balance', address],
    queryFn: async () => {
      if (address) {
        const getBalance = await utilsSui.getSuiClient.getBalance({
          owner: address,
        });

        return Number(getBalance.totalBalance);
      }
    },
  });

  return query;
};
