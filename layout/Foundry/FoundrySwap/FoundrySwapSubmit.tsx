import { useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

import Button3D from 'components/Button/Button3D';
import useToast from 'hook/useToast';

interface FoundrySwapSubmitProps {
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default ({ quantity, setQuantity }: FoundrySwapSubmitProps) => {
  const current_account = useCurrentAccount();

  const [loading, setLoading] = useState<string>();

  const toast = useToast();

  return (
    <>
      <Button3D
        shape="green"
        px={12}
        width="fit-content"
        margin="auto"
        isDisabled={!quantity?.length || !current_account?.address}
        isLoading={loading === 'swap_now'}
        onClick={async () => {
          try {
            setLoading('swap_now');

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
