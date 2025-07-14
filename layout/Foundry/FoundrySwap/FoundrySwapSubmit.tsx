import { Center } from '@chakra-ui/react';
import { useState } from 'react';

import Button3D from 'components/Button/Button3D';
import ConnectWalletWrapper from 'components/ConnectWallet/ConnectWalletWrapper';
import { useAccountContext } from 'components/Context/ContextAccount';
import { useExtensionContext } from 'components/Context/ContextExtension';
import useToast from 'hook/useToast';
import { TypeWalletEnum } from 'types';
import { catchProperties, waitForSeconds } from 'utils';
import utilsSui from 'utils/utils.sui';

interface FoundrySwapSubmitProps {
  quantity: string | undefined;
  setQuantity: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => void;
}

export default ({ quantity, setQuantity, refetch }: FoundrySwapSubmitProps) => {
  const { extension } = useExtensionContext();
  const { account } = useAccountContext();

  const [loading, setLoading] = useState<string>();

  const toast = useToast();

  return (
    <Center>
      <ConnectWalletWrapper
        render={() => (
          <Button3D
            shape="green"
            px={12}
            isDisabled={!quantity?.length || !account}
            isLoading={loading === 'swap_now'}
            onClick={async () => {
              try {
                setLoading('swap_now');

                if (!account) {
                  throw catchProperties({
                    account,
                  });
                }

                if (extension === TypeWalletEnum.Slush) {
                  const tx = utilsSui.transaction();

                  // const amountInSmallestUnit = BigInt(
                  //   parseFloat(amount) * 1_000_000
                  // );
                  // Split the coin and get a new coin with the specified amount
                  // This creates a new coin object with the desired amount to be transferred
                  const [coin] = tx.splitCoins(
                    '0x7e6f6903c316a51281511b331709e7d7844be28ec4aadddc2040ca59a70a4572',
                    [Number(quantity)]
                  );

                  tx.moveCall({
                    target: `${utilsSui.PROGRAM.PACKAGE_ID}::nft::mint_with_swap`,
                    arguments: [
                      tx.object(utilsSui.PROGRAM.COLLECTION_ID),
                      tx.object(utilsSui.PROGRAM.TREASURY_TICKET),
                      tx.object.random(),
                      tx.pure.u64(Number(quantity)),
                    ],
                  });

                  await utilsSui.signAndExecuteTransaction(tx);
                }

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
        )}
        variant={{
          px: 12,
        }}
      />
    </Center>
  );
};
