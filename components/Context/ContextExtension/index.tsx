'use client';

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { TypeWalletEnum } from 'types';
import utilsConstants from 'utils/utils.constants';
import { getCookie, setCookie } from 'utils/utils.cookie';

export interface ExtensionContextProps {
  extension: string | undefined;
  setExtension: Dispatch<SetStateAction<string>>;
}

const ExtensionContext = createContext<ExtensionContextProps>({
  extension: undefined,
  setExtension: () => {},
});

export default ({ children }: PropsWithChildren) => {
  const [extension, setExtension] = useState<string>(
    getCookie(utilsConstants.WALLET_EXTENSION) || TypeWalletEnum.Slush
  );

  return (
    <ExtensionContext.Provider
      value={{
        extension,
        setExtension,
      }}
    >
      {children}
    </ExtensionContext.Provider>
  );
};
export const useExtensionContext = () => {
  const { extension, setExtension } = useContext(ExtensionContext);

  const updateExtension = (extension: string) => {
    setCookie({
      key: utilsConstants.WALLET_EXTENSION,
      value: extension,
    });

    setExtension(extension);
  };

  return {
    extension,
    updateExtension,
  };
};
