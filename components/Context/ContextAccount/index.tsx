'use client';

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
import utilsConstants from 'utils/utils.constants';
import { deleteCookie, getCookie, setCookie } from 'utils/utils.cookie';

export interface AccountContextProps {
  account: string | undefined;
  setAccount: Dispatch<SetStateAction<string | undefined>>;
}

const AccountContext = createContext<AccountContextProps>({
  account: undefined,
  setAccount: () => {},
});

export default ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    const wallet_pk = getCookie(utilsConstants.WALLET_PUBLIC_KEY);

    if (wallet_pk?.length) {
      setAccount(wallet_pk);
    }
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
export const useAccountContext = () => {
  const { account, setAccount } = useContext(AccountContext);

  const connectAccount = (params: {
    wallet: TypeWalletEnum;
    address: string;
  }) => {
    // update cookies
    {
      setCookie({
        key: utilsConstants.WALLET,
        value: params.wallet,
      });

      setCookie({
        key: utilsConstants.WALLET_PUBLIC_KEY,
        value: params.address,
      });
    }

    setAccount(params.address);
  };

  const disconnectAccount = () => {
    deleteCookie(utilsConstants.WALLET_PUBLIC_KEY);
    deleteCookie(utilsConstants.WALLET);
    deleteCookie(utilsConstants.WALLET_EXTENSION);

    setAccount(undefined);
  };

  return {
    account,
    setAccount,
    connectAccount,
    disconnectAccount,
  };
};
