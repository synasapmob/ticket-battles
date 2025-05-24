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

const PACKAGE_ID =
  '0x847947b3506fb0bbfab117d5a7004e549aab7f866fcc32e707c34792421a80b6';

const getSuiClient = new SuiClient({
  network: 'testnet',
  url: networkConfig.testnet.url,
});

export default {
  useNetworkVariable,
  useNetworkVariables,
  networkConfig,
  getSuiClient,
  PACKAGE_ID,
};
