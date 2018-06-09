const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = require('./.mnemonic');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      gasPrice: 20000000000,
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic.seed, 'https://rinkeby.infura.io/b9XMoJFDxpzhBpEGzVaW', 4);
      },
      network_id: 4,
      gas: 7000000
    },

    live: {
      provider: function() {
        return new HDWalletProvider('12 seed words', 'https://mainnet.infura.io/b9XMoJFDxpzhBpEGzVaW');
      },
      network_id: 1,
      gas: 7500000,
      gasPrice: 20000000000
    }
  }
};
