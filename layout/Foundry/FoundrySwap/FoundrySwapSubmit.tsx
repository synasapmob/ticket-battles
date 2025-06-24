import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

import Button3D from 'components/Button/Button3D';
import useToast from 'hook/useToast';
import { waitForSeconds } from 'utils';
import utilsSui from 'utils/utils.sui';

interface FoundrySwapSubmitProps {
  ticketOwnedObject: string | undefined;
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => void;
}

export default ({
  ticketOwnedObject,
  quantity,
  setQuantity,
  refetch,
}: FoundrySwapSubmitProps) => {
  const signTransaction = useSignAndExecuteTransaction();
  const current_account = useCurrentAccount();

  const [loading, setLoading] = useState<string>();

  const toast = useToast();

  return (
    <>
      <Button3D
        shape="green"
        width="fit-content"
        margin="auto"
        px={12}
        isDisabled={!quantity?.length || !current_account?.address}
        isLoading={loading === 'swap_now' || !ticketOwnedObject?.length}
        onClick={async () => {
          try {
            setLoading('swap_now');

            if (!current_account?.address || !ticketOwnedObject?.length) {
              throw 'not found';
            }

            const tx = new Transaction();

            tx.moveCall({
              target: `${utilsSui.PROGRAM.PACKAGE_ID}::nft::mint_with_swap`,
              arguments: [
                tx.object(utilsSui.PROGRAM.COLLECTION_ID),
                tx.object(ticketOwnedObject),
                tx.object.random(),
                tx.pure.u64(Number(quantity)),
              ],
            });

            await signTransaction.mutateAsync({
              transaction: tx as unknown as string,
            });

            await waitForSeconds(() => {
              refetch();
            });

            toast({
              status: 'success',
              description: 'successfuly',
            });

            setQuantity('');
          } catch (error) {
            toast({
              status: 'error',
              description: JSON.stringify(error),
            });
          } finally {
            setLoading(undefined);
          }
        }}
      >
        Swap now
      </Button3D>
    </>
  );
};
