import { SUI_DECIMALS } from '@mysten/sui/utils';
import { ethers } from 'ethers';

import { getCookie } from './utils.cookie';

import { TypeCurrencyEnum, TypeWalletEnum } from 'types';

const WALLET = 'WALLET';
const WALLET_EXTENSION = 'WALLET_EXTENSION';
const WALLET_PUBLIC_KEY = 'WALLET_PUBLIC_KEY';
const WALLET_CONFIG = [
  {
    key: TypeWalletEnum.Slush,
    extension: TypeWalletEnum.Slush,
    symbol: TypeCurrencyEnum.SUI,
    decimal: SUI_DECIMALS,
    rpcUrl: '',
  },
  {
    key: TypeWalletEnum.MetaMask,
    extension: TypeWalletEnum.MetaMask,
    symbol: TypeCurrencyEnum.ETH,
    decimal: 18,
    rpcUrl: 'https://eth-sepolia.public.blastapi.io',
  },
  {
    key: TypeWalletEnum.SubWallet,
    extension: TypeWalletEnum.MetaMask,
    symbol: TypeCurrencyEnum.ETH,
    decimal: 18,
    rpcUrl: 'https://eth-sepolia.public.blastapi.io',
  },
];

const JsonRPC = (params: { name: string; chainId: number | string }) => {
  const config = WALLET_CONFIG.find(meta => meta.key === getCookie(WALLET));

  return new ethers.JsonRpcProvider(config?.rpcUrl, {
    name: params.name,
    chainId: Number(params.chainId),
  });
};

const SOUND_ENABLE_GLOBAL = 'SOUND_ENABLE_GLOBAL';

export default {
  WALLET,
  WALLET_EXTENSION,
  WALLET_CONFIG,
  WALLET_PUBLIC_KEY,

  SOUND_ENABLE_GLOBAL,

  JsonRPC,
};
