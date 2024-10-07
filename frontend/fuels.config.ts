import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../contracts/comp-v',
        '../contracts/src-6-vault-connector',
        '../contracts/oracle'
  ],
  output: './src/sway-api',
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
