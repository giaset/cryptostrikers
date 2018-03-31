const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = require('./.mnemonic');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic.seed, 'https://rinkeby.infura.io/b9XMoJFDxpzhBpEGzVaW', 4);
      },
      network_id: 4,
      gas: 7000000
    }
  }
};
