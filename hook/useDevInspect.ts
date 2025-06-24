import { Transaction } from '@mysten/sui/transactions';
import { useQuery } from '@tanstack/react-query';

import utilsSui from 'utils/utils.sui';

interface useDevInspectProps {
  type: string;
}

export default ({ type }: useDevInspectProps) => {
  const query = useQuery({
    queryKey: ['useDevInspect', type],
    queryFn: async () => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${utilsSui.PROGRAM.PACKAGE_ID}::${type}`,
      });

      const zero_address =
        '0x05153977c37355b20059e6d2163d6e829786ecffd679e573e8d74757913d50a0';

      const result = await utilsSui.getSuiClient.devInspectTransactionBlock({
        sender: zero_address,
        transactionBlock: tx,
      });

      return result.results?.[0]?.returnValues;
    },
  });

  return query;
};
