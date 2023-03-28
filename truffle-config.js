const HDWalletProvider = require("@truffle/hdwallet-provider");
const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      gasPrice: 30000000000,
      disableConfirmationListener: true
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
      disableConfirmationListener: true
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider([process.env.PRIVATE_KEY_TEST], process.env.ROPSTEN_URL)
      },
      network_id: 3,
      gas: 4000000,
      gasPrice: 21000000000
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider([process.env.PRIVATE_KEY], `https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`)
      },
      network_id: 1,
      gas: 2500000,
      gasPrice: 102000000000,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
    bsc: {
      provider: function () {
        return new HDWalletProvider([process.env.PRIVATE_KEY_BSC], `https://bsc-dataseed1.binance.org`)
      },
      network_id: 56,
      gasPrice: 6000000000,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      provider: () => new HDWalletProvider([process.env.PRIVATE_KEY], `wss://rpc-mainnet.maticvigil.com/ws/v1/${process.env.PROJECT_ID_POLYGON}`),
      network_id: 137,
      gasPrice: 80000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 137
    },
    mumbai: {
      provider: () => new HDWalletProvider([process.env.PRIVATE_KEY_TEST], process.env.MUMBAI_URL),
      network_id: '80001',
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 999999,
    }
  },
  api_keys: {
    polygonscan: process.env.POLYGONSCAN_API_KEY
  },
  // mocha: {
  //   enableTimeouts: false,
  //   before_timeout: 60000,
  //   reporter: 'eth-gas-reporter',
  //     reporterOptions: {
  //     token : "MATIC",
  //     gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
  //     showTimeSpent: true,
  //     currency: 'USD',
  //     coinmarketcap: `${process.env.COINMARKETCAP_API_KEY}`
  //   },
  // },
  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: ["solidity-coverage", "truffle-plugin-verify", "truffle-contract-size"]
}

