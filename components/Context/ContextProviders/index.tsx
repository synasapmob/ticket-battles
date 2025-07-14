'use client';

import { Wallet } from '@mysten/wallet-standard';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { TypeWalletEnum } from 'types';
import { TypeEIP6963Props } from 'types/types.eip6963';
import utilsSui from 'utils/utils.sui';

type ProviderFields = {
  [K in TypeWalletEnum]: {
    [TypeWalletEnum.Slush]: Wallet;
    [TypeWalletEnum.MetaMask]: TypeEIP6963Props['provider'];
    [TypeWalletEnum.SubWallet]: TypeEIP6963Props['provider'];
  }[K];
};

export interface ProvidersContextProps {
  providers: Partial<ProviderFields> | undefined;
  setProviders: Dispatch<SetStateAction<Partial<ProviderFields> | undefined>>;
}

const ProvidersContext = createContext<ProvidersContextProps>({
  providers: undefined,
  setProviders: () => {},
});

export default ({ children }: PropsWithChildren) => {
  const [providers, setProviders] = useState<
    ProvidersContextProps['providers']
  >({});

  useEffect(() => {
    setProviders(() => {
      const values: typeof providers = {};

      // looking for Slush
      {
        const wallet = utilsSui.getWallet(TypeWalletEnum.Slush);

        if (wallet) {
          values.Slush = wallet;
        }
      }

      // looking for EVM MetaMask
      {
        window.addEventListener('eip6963:announceProvider', event => {
          const detail = event[
            'detail' as keyof Event
          ] as unknown as TypeEIP6963Props;

          if (detail?.info?.name) {
            values[detail.info.name as never] = detail.provider as never;
          }
        });

        window.dispatchEvent(new Event('eip6963:requestProvider'));
      }

      return values;
    });
  }, []);

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        setProviders,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};
export const useProvidersContext = () => {
  const { providers } = useContext(ProvidersContext);

  return {
    providers,
  };
};
