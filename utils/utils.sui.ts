import {
  GetOwnedObjectsParams,
  QueryEventsParams,
  SuiClient,
  SuiObjectRef,
} from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import {
  getWallets,
  StandardConnect,
  StandardConnectFeature,
  SuiSignAndExecuteTransaction,
  SuiSignAndExecuteTransactionFeature,
  Wallet,
} from '@mysten/wallet-standard';

import { TypeWalletEnum } from 'types';
import { catchProperties } from 'utils';

const networkConfig = {
  devnet: {
    url: 'https://fullnode.devnet.sui.io:443',
  },
  testnet: {
    url: 'https://fullnode.testnet.sui.io:443',
  },
  mainnet: {
    url: 'https://fullnode.mainnet.sui.io:443',
  },
};

const PROGRAM = {
  COLLECTION_ID:
    '0x60eb1e1d270c2102f25521d068a779047b28d11fad06a9c1c7fe6c73bb2024b5',

  POOL_ID: '0x70474d30d9e9482f55daa067a31196e0ddeff6043a6a1c30419583b98dc46e30',

  TREASURY_TICKET:
    '0x64554ac8ff56e87a8d16a34f1eb54ff267be34b14c716e7c160e6c972a62e787',

  COIN_TICKET:
    '0x864a40d25633cc4bea1c02b67329c8f796bb15fc031a314bc257dc65def2aa10',

  PACKAGE_ID:
    '0x009d89b1b869be3743086ed32a5ae5d9fd1efed22aadb55e7fc89f695b409f63',
};

const getSuiClient = new SuiClient({
  network: process.env.NETWORK_VERSION,
  url: networkConfig.testnet.url,
});

const getWallet = (wallet: TypeWalletEnum) => {
  return getWallets()
    .get()
    .find(argument => argument.name === wallet) as Wallet;
};

const signAndExecuteTransaction = async (transaction: Transaction) => {
  const wallet = getWallet(TypeWalletEnum.Slush);

  if (!wallet) {
    throw catchProperties({
      wallet,
    });
  }

  // make sure you connected
  const { accounts } = await (wallet.features as StandardConnectFeature)[
    StandardConnect
  ].connect();

  return await (wallet.features as SuiSignAndExecuteTransactionFeature)[
    SuiSignAndExecuteTransaction
  ].signAndExecuteTransaction({
    transaction,
    account: accounts[0],
    chain: `sui:${getSuiClient.network}`,
  });
};

const transaction = () => {
  return new Transaction();
};

const devInspect = async (contract: string) => {
  const tx = transaction();

  tx.moveCall({
    target: `${PROGRAM.PACKAGE_ID}::${contract}`,
  });

  const zero_address =
    '0x05153977c37355b20059e6d2163d6e829786ecffd679e573e8d74757913d50a0';

  const result = await getSuiClient.devInspectTransactionBlock({
    sender: zero_address,
    transactionBlock: tx,
  });

  return result.results?.[0]?.returnValues;
};

const getOwnedObject = async <T>(params: {
  type: string;
  options: GetOwnedObjectsParams;
}) => {
  const { data } = await getSuiClient.getOwnedObjects({
    ...params.options,

    filter: {
      StructType: `${PROGRAM.PACKAGE_ID}::${params.type}`,

      ...params.options.filter,
    },

    options: {
      showContent: true,

      ...params.options?.options,
    },
  });

  return data.map(meta => meta.data as T & SuiObjectRef);
};

const queryEvents = async <T>(params: {
  type: string;
  options?: Partial<QueryEventsParams>;
}) => {
  const { data } = await getSuiClient.queryEvents({
    ...params?.options,

    // modify
    query: {
      MoveEventType: `${PROGRAM.PACKAGE_ID}::${params.type}`,

      ...params.options?.query,
    },
  });

  return data.map(meta => meta.parsedJson as T);
};

export default {
  networkConfig,
  getSuiClient,
  PROGRAM,

  // CB
  getWallet,
  signAndExecuteTransaction,
  transaction,
  devInspect,
  getOwnedObject,
  queryEvents,
};
