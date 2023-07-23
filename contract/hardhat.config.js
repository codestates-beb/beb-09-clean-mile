require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  networks: {
    dev: {
      url: 'http://localhost:8545', // ganache running on port 8545
      accounts: [
        process.env.DEV_ACCOUNT_PRIVATE_KEY, // private key of the first account
      ],
    },
  },
};
