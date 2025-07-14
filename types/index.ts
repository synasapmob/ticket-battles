/* eslint-disable no-unused-vars */

export type TypeOwnedObjectSuiParsedData<T> = {
  content: {
    fields: T;
  };
};

export enum TypeWalletEnum {
  Slush = 'Slush',
  MetaMask = 'MetaMask',
  SubWallet = 'SubWallet',
}

export enum TypeCurrencyEnum {
  SUI = 'Sui',
  ETH = 'ETH',
}
