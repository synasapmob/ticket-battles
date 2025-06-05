import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';

import Button3D from 'components/Button/Button3D';
import useToast from 'hook/useToast';
import { waitForSeconds } from 'utils';
import utilsSui from 'utils/utils.sui';
interface FoundrySwapSubmitProps {
  getTicketOwner: UseQueryResult<string[] | undefined, Error>;
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default ({
  getTicketOwner,
  quantity,
  setQuantity,
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
        isLoading={loading === 'swap_now' || getTicketOwner.isLoading}
        onClick={async () => {
          try {
            setLoading('swap_now');

            if (!current_account?.address || !getTicketOwner.data?.length) {
              throw 'not found';
            }

            const tx = new Transaction();

            tx.moveCall({
              target: `${utilsSui.PROGRAM.PACKAGE}::nft::mint`,
              arguments: [
                tx.object(utilsSui.PROGRAM.COLLECTION),
                tx.object(getTicketOwner.data[0]),
              ],
            });

            await signTransaction.mutateAsync({
              transaction: tx,
            });

            await waitForSeconds(() => {
              getTicketOwner.refetch();
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
