'use client';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { PropsWithChildren } from 'react';

import utilsSui from 'utils/utils.sui';

export default ({ children }: PropsWithChildren) => {
  return (
    <SuiClientProvider
      networks={utilsSui.networkConfig}
      defaultNetwork="testnet"
    >
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
};
