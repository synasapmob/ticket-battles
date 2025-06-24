import { useQuery } from '@tanstack/react-query';
import { SuiObjectRef } from 'node_modules/@mysten/sui/dist/esm/bcs/types';
import { GetOwnedObjectsParams } from 'node_modules/@mysten/sui/dist/esm/client';

import utilsSui from 'utils/utils.sui';

interface useOwnedObjectProps {
  queryKey: Partial<string | string[]>;
  input: GetOwnedObjectsParams;
}

export default <T>({ queryKey, input }: useOwnedObjectProps) => {
  const query = useQuery({
    queryKey: ['useOwnedObject', queryKey],
    queryFn: async () => {
      if (input?.owner?.length) {
        const { data } = await utilsSui.getSuiClient.getOwnedObjects(input);

        return data.map(meta => meta.data as T & SuiObjectRef);
      }
    },
  });

  return query;
};
