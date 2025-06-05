import { createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl('devnet'),
    },
    testnet: {
      url: getFullnodeUrl('testnet'),
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
    },
  });

const PROGRAM = {
  PACKAGE: '0xd7782cea56d54201f70d42722c3de6104885668856aa1dc6868f0d4ce28a146b',

  COLLECTION:
    '0x84a16ea896b3860b86a00223c6ace53f6c1ad3c7b5f48daf6134a2b4b57dab28',
};

const getSuiClient = new SuiClient({
  network: 'testnet',
  url: networkConfig.testnet.url,
});

export default {
  useNetworkVariable,
  useNetworkVariables,
  networkConfig,
  getSuiClient,
  PROGRAM,
};
