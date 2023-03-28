module.exports = {
  client: require('ganache'),
  providerOptions: {
    norpc: true,
    port: 8545,
  },
  skipFiles: ["mock", "Migrations"],
};