import { QueryEventsParams } from '@mysten/sui/client';
import { useQuery } from '@tanstack/react-query';

import utilsSui from 'utils/utils.sui';

interface useQueryEventProps {
  type: string;
  options?: Partial<QueryEventsParams>;
}

export default <T>({ type, options }: useQueryEventProps) => {
  const query = useQuery({
    queryKey: ['useQueryEvent', type],
    queryFn: async () => {
      const { data } = await utilsSui.getSuiClient.queryEvents({
        query: {
          MoveEventType: `${utilsSui.PROGRAM.PACKAGE_ID}::${type}`,
          ...options?.query,
        },

        ...options,
      });

      return data.map(meta => meta.parsedJson as T);
    },
  });

  return query;
};
